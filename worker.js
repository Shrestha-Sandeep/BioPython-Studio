'use strict';
// A true Python interpreter is used, not a JavaScript approximation.
// This is a bounded educational Web Worker, not a high-assurance sandbox.
const PYODIDE_ROOT = 'https://cdn.jsdelivr.net/pyodide/v0.28.3/full/';
const HARNESS = String.raw`
"""Original BioPython Studio training harness; executes user Python against changing data."""
import ast
import io
import sys
import json
import base64
import contextlib
import traceback

SAFE_MODULES = {'numpy', 'pandas', 'matplotlib', 'math', 'scipy'}

def restricted_import(name, globals=None, locals=None, fromlist=(), level=0):
    if name.split('.')[0] not in SAFE_MODULES:
        raise ImportError('Only NumPy, Pandas, Matplotlib and math imports are available here.')
    return __import__(name, globals, locals, fromlist, level)

BUILTINS = {
    'print': print, 'sum': sum, 'len': len, 'range': range,
    'round': round, 'int': int, 'float': float, 'str': str,
    'list': list, 'dict': dict, 'tuple': tuple, 'min': min,
    'max': max, 'abs': abs, 'enumerate': enumerate, 'zip': zip,
    'bool': bool, 'sorted': sorted, 'isinstance': isinstance,
    '__import__': restricted_import,
}

def close(a,b,tol=1e-5):
    try:
        return abs(float(a)-float(b)) < tol
    except (TypeError, ValueError):
        return False

def check(lesson, namespace, report, case):
    output = report['output'].strip()
    def output_number():
        try: return float(output)
        except ValueError: return None
    if lesson == 'sample':
        return output == case['sample_id'], 'Use the provided sample_id instead of one fixed specimen name.'
    if lesson == 'change':
        expect = round((case['treated']-case['control']) / case['control'] * 100, 1)
        return close(namespace.get('change_pct'), expect, 0.051) and close(output_number(), expect, 0.051), 'Calculate the percentage relative to the control, then print change_pct.'
    if lesson == 'replicates':
        expect = sum(case['counts'])
        return namespace.get('total') == expect and close(output_number(), expect), 'Use sum(counts) and print the total; different samples have different numbers of fields.'
    if lesson == 'function':
        fun = namespace.get('mean_signal')
        expect = sum(case['signals']) / len(case['signals'])
        return callable(fun) and close(output_number(), round(expect,2), 0.015) and close(fun(case['signals']), expect, .0001), 'Define mean_signal(values) and return the computed mean for different input lists.'
    if lesson == 'shape':
        shape = tuple(namespace['image'].shape)
        return output.replace(' ','') == str(shape).replace(' ',''), 'Print image.shape, not the dimensions of one particular example.'
    if lesson == 'pixel':
        value = int(namespace['image'][20,25])
        return close(output_number(), value), 'Read the pixel at row 20, column 25 using image[20, 25].'
    if lesson == 'mask':
        np = namespace['np']; img = namespace['image']; mask = namespace.get('mask')
        if not isinstance(mask, np.ndarray) or mask.shape != img.shape:
            return False, 'Create a NumPy boolean array named mask with one value per image pixel.'
        truth = img > case['threshold']
        correct = bool(np.array_equal(mask, truth))
        report['mask'] = mask.astype('uint8').tolist() if correct else None
        return correct and close(output_number(), int(truth.sum())), 'Compare image > threshold, then print int(mask.sum()). This counts pixels, not biological objects.'
    if lesson == 'table':
        pd = namespace['pd']; df = namespace.get('df'); target = sum(r['bright_pixels'] for r in case['rows'])
        if not isinstance(df, pd.DataFrame) or not {'sample_id','bright_pixels'}.issubset(set(df.columns)):
            return False, 'Create a Pandas DataFrame named df from the provided rows.'
        valid = df[['sample_id','bright_pixels']].to_dict('records') == [{k:r[k] for k in ('sample_id','bright_pixels')} for r in case['rows']]
        if valid: report['table'] = df.head(8).to_dict('records')
        return valid and close(output_number(), target), 'Build df = pd.DataFrame(rows), then sum the bright_pixels column.'
    if lesson == 'group':
        pd = namespace['pd']; table = namespace.get('df'); means = namespace.get('means')
        if not isinstance(table, pd.DataFrame) or not isinstance(means, pd.Series):
            return False, 'Build a DataFrame, then assign means = df.groupby("condition")["bright_pixels"].mean().'
        expected = pd.DataFrame(case['rows']).groupby('condition')['bright_pixels'].mean()
        if set(means.index) != set(expected.index) or any(not close(means.loc[k], expected.loc[k]) for k in expected.index):
            return False, 'Group by condition before calculating means. Individual images are not necessarily biological replicates.'
        report['table'] = [{'condition':str(k),'mean_bright_pixels':round(float(v),2)} for k,v in means.items()]
        expect_delta = expected['treated']-expected['control']
        return close(output_number(), round(float(expect_delta), 2), 0.011), 'Print the treated mean minus the control mean, rounded to two decimals.'
    if lesson == 'plot':
        fig = namespace.get('fig'); ax = namespace.get('ax')
        if fig is None or ax is None or not hasattr(ax, 'patches'):
            return False, 'Create fig, ax = plt.subplots(), then use ax.bar(...) to plot two group means.'
        patches = list(ax.patches)
        if len(patches) != 2 or not (close(patches[0].get_height(), case['control_mean']) and close(patches[1].get_height(), case['treated_mean'])):
            return False, 'The figure needs two bars, using control_mean and treated_mean in that order.'
        if not ax.get_ylabel().strip():
            return False, 'Label the y-axis with the measured quantity and units.'
        report['plot_ready'] = True
        return True, ''
    if lesson == 'transfer':
        func = namespace.get('summarize')
        if not callable(func): return False, 'Write a function summarize(sample_id, counts) that returns a dictionary.'
        try: result = func(case['sample_id'], case['counts'])
        except Exception as e: return False, 'Your function failed for an unfamiliar specimen: ' + str(e)
        expected_mean = round(sum(case['counts'])/len(case['counts']),2)
        correct = isinstance(result, dict) and result.get('sample_id') == case['sample_id'] and result.get('total') == sum(case['counts']) and close(result.get('mean'), expected_mean, .01)
        if correct:
            report['table'] = [{'sample_id':result['sample_id'], 'total':result['total'], 'mean':result['mean']}]
        return correct, 'Return a dictionary with sample_id, total and mean computed from the function arguments.'

    # Chunk 1: applied scientific Python & real-image field work.
    if lesson == 'sample_parts':
        expected = case['sample_id'].split('-')[0]
        return namespace.get('group') == expected and output == expected, 'Use sample_id.split("-")[0]; store it in group and print group.'
    if lesson == 'gc_fraction':
        seq = case['sequence']
        expected = round(100 * (seq.count('G') + seq.count('C')) / len(seq), 1)
        return close(namespace.get('gc_pct'), expected, .01) and close(output_number(), expected, .01), 'Use the changing sequence string; calculate G+C over length, multiply by 100 and round once.'
    if lesson == 'quality_filter':
        expected = [v for v in case['signals'] if v >= case['minimum']]
        kept = namespace.get('kept')
        return isinstance(kept, list) and kept == expected and close(output_number(), len(expected)), 'Filter signals using the supplied minimum; keep every qualifying value and print the length.'
    if lesson == 'metadata_dict':
        expected = {k:case[k] for k in ('sample_id','condition','bio_rep')}
        record = namespace.get('record')
        return isinstance(record, dict) and all(record.get(k)==v for k,v in expected.items()) and output == f"{expected['condition']}:{expected['bio_rep']}", 'Build record with all 3 supplied fields, then print condition:bio_rep using record.'
    if lesson == 'roi_crop':
        np = namespace['np']; img=namespace['image']; roi=namespace.get('roi')
        actual = img[case['r0']:case['r1'],case['c0']:case['c1']]
        correct = isinstance(roi,np.ndarray) and roi.shape==actual.shape and np.array_equal(roi, actual)
        return correct and output.replace(' ','') == str(actual.shape).replace(' ',''), 'Use both supplied row and column slice boundaries; print roi.shape.'
    if lesson == 'roi_mean':
        np=namespace['np']; img=namespace['image']; roi=namespace.get('roi')
        actual=img[case['r0']:case['r1'],case['c0']:case['c1']]
        expected=float(actual.mean())
        if not isinstance(roi,np.ndarray) or not np.array_equal(roi,actual):
            return False, 'Crop the precise ROI with the changing boundaries first.'
        return close(namespace.get('mean_intensity'),expected,.0001) and close(output_number(),round(expected,2),.015), 'Save float(roi.mean()) in mean_intensity, then print round(mean_intensity,2).'
    if lesson == 'bright_fraction':
        np=namespace['np'];img=namespace['image']; mask=namespace.get('mask')
        truth=img>case['threshold']; expected=float(truth.mean())
        if not isinstance(mask,np.ndarray) or mask.dtype.kind!='b' or not np.array_equal(mask,truth):
            return False, 'Your mask must be a Boolean image > the supplied changing threshold.'
        correct = close(namespace.get('fraction'),expected,.0001) and close(output_number(),round(expected,3),.0011)
        if correct:report['mask']=mask.astype('uint8').tolist()
        return correct, 'Compute float(mask.mean()) and print it rounded to three decimals.'
    if lesson == 'background_subtract':
        np=namespace['np']; img=namespace['image']; arr=namespace.get('corrected')
        expected=np.maximum(img.astype(np.int16)-case['background'],0)
        valid=isinstance(arr,np.ndarray) and arr.shape==img.shape and arr.dtype.kind in 'if' and np.array_equal(arr,expected)
        return valid and close(output_number(),int(expected.sum())), 'Cast uint8 to a signed or floating type BEFORE subtraction; clip negative values at zero.'
    if lesson == 'intensity_hist':
        np=namespace['np']; hist=namespace.get('hist')
        expected,_ = np.histogram(namespace['image'],bins=4,range=(0,256))
        valid=isinstance(hist,np.ndarray) and hist.shape==(4,) and np.array_equal(hist,expected)
        return valid and close(output_number(),int(expected[-1])), 'Use np.histogram(image, bins=4, range=(0,256)) and print the final bin count.'
    if lesson == 'candidate_regions':
        np=namespace['np'];img=namespace['image'];mask=namespace.get('mask');labels=namespace.get('labels')
        truth=img>case['threshold']
        from scipy import ndimage as ndi
        target,n=ndi.label(truth)
        valid=(isinstance(mask,np.ndarray) and mask.dtype.kind=='b' and np.array_equal(mask,truth)
             and isinstance(labels,np.ndarray) and np.array_equal(labels,target)
             and namespace.get('region_count')==n and close(output_number(),n))
        if valid:report['mask']=mask.astype('uint8').tolist()
        return valid, 'Use labels, region_count = ndi.label(mask). Candidate regions are not necessarily individual cells.'
    if lesson == 'missing_records':
        pd=namespace['pd'];df=namespace.get('df');clean=namespace.get('clean')
        expected=pd.DataFrame(case['rows']);want=expected.dropna(subset=['bright_pixels'])
        valid=(isinstance(df,pd.DataFrame) and isinstance(clean,pd.DataFrame)
          and df.equals(expected) and clean.equals(want) and close(output_number(),len(want)))
        if valid:report['table']=clean.head(8).to_dict('records')
        return valid, 'Build df from rows, then clean = df.dropna(subset=["bright_pixels"]). Keep measured zeros.'
    if lesson == 'join_metadata':
        pd=namespace['pd'];merged=namespace.get('merged')
        expected=pd.DataFrame(case['measurements']).merge(pd.DataFrame(case['metadata']),on='sample_id',validate='many_to_one')
        valid=isinstance(merged,pd.DataFrame) and merged.equals(expected) and close(output_number(),len(expected))
        if valid:report['table']=merged.head(8).to_dict('records')
        return valid, 'Merge measurements with metadata on sample_id using validate="many_to_one"; print the number of merged rows.'
    if lesson == 'replicate_means':
        pd=namespace['pd'];df=namespace.get('df');rep=namespace.get('rep_means');cond=namespace.get('condition_means')
        expected_df=pd.DataFrame(case['rows'])
        expected_rep=expected_df.groupby(['condition','bio_rep'])['bright_pixels'].mean()
        expected_cond=expected_rep.groupby(level='condition').mean()
        delta=round(float(expected_cond['treated']-expected_cond['control']),2)
        valid=(isinstance(df,pd.DataFrame) and df.equals(expected_df) and isinstance(rep,pd.Series)
             and isinstance(cond,pd.Series) and rep.equals(expected_rep) and cond.equals(expected_cond)
             and close(output_number(),delta,.011))
        if valid:report['table']=[{'condition':str(k),'mean_per_biological_replicate':float(v)} for k,v in cond.items()]
        return valid, 'First average fields within condition and bio_rep, THEN average biological replicates per condition.'
    if lesson == 'field_report':
        np=namespace['np'];fun=namespace.get('analyze');img=namespace['image']
        if not callable(fun):return False, 'Define analyze(sample_id, image, threshold) as a reusable function.'
        try:result=fun(case['sample_id'],img,case['threshold'])
        except Exception as e:return False, 'Your analysis failed for a new image: '+str(e)[:200]
        from scipy import ndimage as ndi
        mask=img>case['threshold'];region_count=int(ndi.label(mask)[1])
        expected={'sample_id':case['sample_id'],'bright_pixels':int(mask.sum()),'bright_fraction':round(float(mask.mean()),3),'regions':region_count}
        good=(isinstance(result,dict) and result.get('sample_id')==expected['sample_id']
             and result.get('bright_pixels')==expected['bright_pixels']
             and close(result.get('bright_fraction'),expected['bright_fraction'],.0005)
             and result.get('regions')==expected['regions'] and close(output_number(),expected['bright_pixels']))
        if good:
            report['mask']=mask.astype('uint8').tolist()
            report['table']=[result]
        return good, 'Return the actual sample ID, bright pixel count, fraction and connected-region count from the function arguments.'
    return False, 'Unknown learning task.'

def evaluate(lesson, source, cases, make_plot=True):
    if not isinstance(source,str) or not source.strip() or len(source)>5000:
        return {'ok':False,'message':'Write up to 5,000 characters of Python code first.','cases':[]}
    if not isinstance(cases,list) or len(cases) > 5:
        return {'ok':False,'message':'Invalid practice data.','cases':[]}
    try:
        tree = ast.parse(source, '<training>')
    except SyntaxError as e:
        return {'ok':False,'message':f'Syntax error (line {e.lineno}): {e.msg}. Check brackets, colons and indentation.','cases':[]}
    nodes = list(ast.walk(tree))
    if len(nodes)>400 or any(isinstance(n,(ast.ClassDef,ast.Try,ast.With,ast.AsyncFunctionDef,ast.AsyncFor,ast.AsyncWith,ast.Lambda,ast.ImportFrom,ast.Global,ast.Nonlocal,ast.Delete)) for n in nodes):
        return {'ok':False,'message':'This training task supports straightforward Python statements, functions and supported library imports.','cases':[]}
    if any(isinstance(n,ast.Attribute) and n.attr.startswith('_') for n in nodes):
        return {'ok':False,'message':'Private Python attributes are outside the training task.','cases':[]}
    if any(isinstance(n,ast.Name) and n.id.startswith('__') for n in nodes):
        return {'ok':False,'message':'Python internal variables are outside the training task.','cases':[]}
    reports = []
    for number, case in enumerate(cases):
        namespace={'__builtins__':BUILTINS}
        namespace.update({k:v for k,v in case.items() if k!='image'})
        if lesson in ('shape', 'pixel', 'mask', 'roi_crop', 'roi_mean', 'bright_fraction', 'background_subtract', 'intensity_hist', 'candidate_regions', 'field_report', 'table', 'group', 'plot', 'missing_records', 'join_metadata', 'replicate_means'):
            import numpy as np
            namespace['np'] = np
            if 'image' in case:
                namespace['image'] = np.asarray(case['image'], dtype=np.uint8)
        if lesson in ('table', 'group', 'plot', 'missing_records', 'join_metadata', 'replicate_means'):
            import pandas as pd
            namespace['pd']=pd
        if lesson=='plot':
            import matplotlib
            matplotlib.use('Agg')
            import matplotlib.pyplot as plt
            plt.close('all')
            namespace['plt']=plt
        if lesson in ('candidate_regions', 'field_report'):
            from scipy import ndimage as ndi
            namespace['ndi']=ndi
        output=io.StringIO()
        report={'input_index':number,'output':'','error':None}
        counter=[0]
        def tracer(frame,event,arg):
            if event=='line' and frame.f_code.co_filename=='<training>':
                counter[0]+=1
                if counter[0]>3000: raise ValueError('Too many code steps. Check for an infinite loop.')
            return tracer
        try:
            sys.settrace(tracer)
            with contextlib.redirect_stdout(output):
                exec(compile(tree,'<training>','exec'),namespace,namespace)
        except Exception as e:
            report['error']=f'{type(e).__name__}: {str(e)[:300]}'
        finally:
            sys.settrace(None)
        report['output']=output.getvalue()[:1000]
        if report['error']:
            reports.append(report)
            return {'ok':False,'message':report['error'], 'cases':reports}
        passed,hint=check(lesson,namespace,report,case)
        if not passed:
            reports.append(report)
            return {'ok':False,'message':hint,'cases':reports}
        if lesson=='plot' and number==0 and make_plot:
            import matplotlib.pyplot as plt
            buf=io.BytesIO()
            try:
                namespace['fig'].savefig(buf,format='png',dpi=85,bbox_inches='tight')
                encoded=base64.b64encode(buf.getvalue()).decode('ascii')
                if len(encoded)<850000: report['plot_png']=encoded
            finally:
                plt.close('all')
        reports.append(report)
    return {'ok':True,'message':'Your code worked across '+str(len(reports))+' changed scientific inputs.', 'cases':reports}

def evaluate_json(lesson,code,cases_json):
    return json.dumps(evaluate(lesson,code,json.loads(cases_json)))
`;

let runtimePromise = null;
let loaded = new Set();
function sendStatus(message){ postMessage({type:'status',message}); }
async function loadRuntime() {
  if (!runtimePromise) {
    runtimePromise = (async () => {
      sendStatus('Downloading Python runtime (first use)…');
      importScripts(PYODIDE_ROOT + 'pyodide.js');
      const py = await self.loadPyodide({indexURL:PYODIDE_ROOT});
      py.runPython(HARNESS);
      return py;
    })();
  }
  return runtimePromise;
}
async function loadForLesson(py,lesson) {
  const need = [];
  if (["shape","pixel","mask","roi_crop","roi_mean","bright_fraction","background_subtract","intensity_hist","candidate_regions","field_report","table","group","plot","missing_records","join_metadata","replicate_means"].includes(lesson) && !loaded.has('numpy')) need.push('numpy');
  if (["table","group","plot","missing_records","join_metadata","replicate_means"].includes(lesson) && !loaded.has('pandas')) need.push('pandas');
  if (lesson==='plot' && !loaded.has('matplotlib')) need.push('matplotlib');
  if (["candidate_regions","field_report"].includes(lesson) && !loaded.has('scipy')) need.push('scipy');
  if(need.length){
    sendStatus('Loading scientific Python packages: '+need.join(', ')+'…');
    await py.loadPackage(need);
    for (const name of need) loaded.add(name);
  }
}
onmessage=async event => {
  const {requestId,lesson,source,cases}=event.data||{};
  if (typeof requestId!=='number'||!lesson||typeof source!=='string')return;
  try{
    const py=await loadRuntime();
    await loadForLesson(py,lesson);
    sendStatus('Running Python and checking changed data…');
    py.globals.set('training_lesson',lesson);
    py.globals.set('training_source',source);
    py.globals.set('training_cases',JSON.stringify(cases));
    const text=py.runPython('evaluate_json(training_lesson, training_source, training_cases)');
    postMessage({type:'result',requestId,...JSON.parse(text)});
  }catch(error){
    postMessage({type:'error',requestId,message:String(error?.message||error)});
  }
};