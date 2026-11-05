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

SAFE_MODULES = {'numpy', 'pandas', 'matplotlib', 'math'}

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
        if lesson in ('shape','pixel','mask','table','group','plot'):
            import numpy as np
            namespace['np'] = np
            if 'image' in case:
                namespace['image'] = np.asarray(case['image'], dtype=np.uint8)
        if lesson in ('table','group','plot'):
            import pandas as pd
            namespace['pd']=pd
        if lesson=='plot':
            import matplotlib
            matplotlib.use('Agg')
            import matplotlib.pyplot as plt
            plt.close('all')
            namespace['plt']=plt
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
  if (['shape','pixel','mask','table','group','plot'].includes(lesson) && !loaded.has('numpy')) need.push('numpy');
  if (['table','group','plot'].includes(lesson) && !loaded.has('pandas')) need.push('pandas');
  if (lesson==='plot' && !loaded.has('matplotlib')) need.push('matplotlib');
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