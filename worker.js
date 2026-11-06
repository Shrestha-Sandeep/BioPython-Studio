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

SAFE_MODULES = {'numpy', 'pandas', 'matplotlib', 'math', 'scipy', 'skimage', 'Bio', 'sklearn'}

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
    'ord': ord, 'set': set, 'all': all, 'any': any, 'next': next,
    '__import__': restricted_import,
}

def close(a,b,tol=1e-5):
    try:
        return abs(float(a)-float(b)) < tol
    except (TypeError, ValueError):
        return False


# Extension lesson groups are kept explicit to avoid loading large scientific
# libraries in unrelated beginner tasks.
ADVANCED_LESSONS = ['dtype_conversion', 'axis_selection', 'pixel_area', 'percentile_mask', 'gaussian_smooth', 'percentile_background', 'morphological_open', 'skimage_label', 'remove_small', 'region_table', 'segmentation_precision', 'imaging_pipeline', 'csv_import', 'clean_ids', 'schema_missing', 'duplicate_ids', 'batch_normalize', 'paired_change', 'bio_replicate_n', 'standard_error', 'confidence_interval', 'robust_median', 'errorbar_plot', 'reproducible_report', 'reverse_complement', 'fasta_parse', 'trim_quality', 'fastq_qc', 'kmer_counts', 'read_coverage', 'count_cpm', 'puncta_peaks', 'track_displacement', 'group_safe_split', 'ml_classifier', 'final_research_pipeline']
ADVANCED_IMAGE = ['dtype_conversion', 'axis_selection', 'pixel_area', 'percentile_mask', 'gaussian_smooth', 'percentile_background', 'morphological_open', 'skimage_label', 'remove_small', 'region_table', 'imaging_pipeline', 'puncta_peaks', 'final_research_pipeline']
ADVANCED_NUMPY = ['dtype_conversion', 'axis_selection', 'pixel_area', 'percentile_mask', 'gaussian_smooth', 'percentile_background', 'morphological_open', 'skimage_label', 'remove_small', 'region_table', 'imaging_pipeline', 'puncta_peaks', 'final_research_pipeline', 'segmentation_precision', 'standard_error', 'confidence_interval', 'robust_median', 'read_coverage', 'count_cpm', 'track_displacement', 'group_safe_split', 'ml_classifier']
ADVANCED_PANDAS = ['region_table', 'csv_import', 'duplicate_ids', 'batch_normalize', 'paired_change', 'bio_replicate_n', 'reproducible_report']
ADVANCED_SCIPY = ['gaussian_smooth', 'morphological_open', 'confidence_interval', 'puncta_peaks']
ADVANCED_SKIMAGE = ['skimage_label', 'remove_small', 'region_table', 'imaging_pipeline', 'final_research_pipeline']
ADVANCED_BIOPYTHON = ['fasta_parse', 'fastq_qc']
ADVANCED_SKLEARN = ['group_safe_split', 'ml_classifier']
ADVANCED_PLOT = ['errorbar_plot']

def check_advanced(lesson, ns, report, case):
    import numpy as _np
    output=report['output'].strip()
    def numeric(value):
        try: return float(value)
        except (TypeError,ValueError): return None
    def good_number(value, expected, tol=.001):
        return close(value, expected, tol)
    def num_out(expected,tol=.001):
        return good_number(numeric(output),expected,tol)
    def full_array(value,expected,kind=None):
        if not isinstance(value,_np.ndarray) or value.shape!=expected.shape: return False
        if kind is not None and value.dtype.kind not in kind:return False
        return bool(_np.allclose(value,expected,atol=1e-7,rtol=1e-7))
    try:
        if lesson=='dtype_conversion':
            expected=ns['image'].astype(_np.uint16)*257
            ok=full_array(ns.get('image16'),expected) and ns['image16'].dtype==_np.dtype('uint16') and output=='uint16'
            return ok,'Cast to uint16 BEFORE multiplying by 257. The JPEG does not become true raw 16-bit data.'
        if lesson=='axis_selection':
            stack=ns['stack']; expected=stack[case['frame_index']]
            ok=full_array(ns.get('plane'),expected) and output.replace(' ','')==str(expected.shape).replace(' ','')
            return ok,'Select the supplied frame_index from stack and print the 2D plane shape.'
        if lesson=='pixel_area':
            mask=ns['image']>case['threshold']; expected=float(mask.sum())*case['pixel_size_um']**2
            ok=full_array(ns.get('mask'),mask,'b') and good_number(ns.get('area_um2'),expected,.0001) and num_out(round(expected,2),.011)
            if ok:report['mask']=mask.astype('uint8').tolist()
            return ok,'One pixel area is pixel_size_um**2, not pixel_size_um.'
        if lesson=='percentile_mask':
            cut=float(_np.percentile(ns['image'],case['percentile']));mask=ns['image']>cut
            ok=good_number(ns.get('cutoff'),cut,.00001) and full_array(ns.get('mask'),mask,'b') and num_out(int(mask.sum()))
            if ok:report['mask']=mask.astype('uint8').tolist()
            return ok,'Use np.percentile(image, percentile) and compare image > cutoff.'
        if lesson=='gaussian_smooth':
            from scipy import ndimage as ndi
            expected=ndi.gaussian_filter(ns['image'].astype(float),sigma=case['sigma']);value=ns.get('smoothed')
            ok=full_array(value,expected,'f') and num_out(round(float(expected.std()),2),.011)
            return ok,'Convert to float and use ndi.gaussian_filter(image, sigma=sigma).';
        if lesson=='percentile_background':
            bg=float(_np.percentile(ns['image'],case['percentile']))
            expected=_np.maximum(ns['image'].astype(float)-bg,0)
            ok=good_number(ns.get('background'),bg) and full_array(ns.get('corrected'),expected,'f') and num_out(round(float(expected.sum()),1),.11)
            return ok,'Use an image-specific percentile background, convert to float, subtract and clip at zero.'
        if lesson=='morphological_open':
            from scipy import ndimage as ndi
            mask=ns['image']>case['threshold'];expected=ndi.binary_opening(mask)
            ok=full_array(ns.get('mask'),mask,'b') and full_array(ns.get('cleaned'),expected,'b') and num_out(int(expected.sum()))
            if ok:report['mask']=expected.astype('uint8').tolist()
            return ok,'Use ndi.binary_opening(mask) and print the remaining true-pixel count.'
        if lesson=='skimage_label':
            from skimage import measure
            mask=ns['image']>case['threshold'];target=measure.label(mask,connectivity=2)
            ok=full_array(ns.get('mask'),mask,'b') and full_array(ns.get('labels'),target,'iu') and num_out(target.max())
            if ok:report['mask']=mask.astype('uint8').tolist()
            return ok,'Use measure.label(mask, connectivity=2) on the thresholded image.'
        if lesson=='remove_small':
            from skimage import morphology
            mask=ns['image']>case['threshold'];target=morphology.remove_small_objects(mask,min_size=case['min_size'])
            ok=full_array(ns.get('mask'),mask,'b') and full_array(ns.get('cleaned'),target,'b') and num_out(target.sum())
            if ok:report['mask']=target.astype('uint8').tolist()
            return ok,'Filter whole connected components using the supplied min_size.'
        if lesson=='region_table':
            from skimage import measure
            import pandas as pd
            target=measure.label(ns['image']>case['threshold'],connectivity=2)
            props=measure.regionprops_table(target,intensity_image=ns['image'],properties=('label','area','mean_intensity'))
            expected=pd.DataFrame(props);got=ns.get('df')
            valid=(full_array(ns.get('labels'),target,'iu') and isinstance(got,pd.DataFrame) and set(expected.columns)==set(got.columns) and len(got)==len(expected))
            if valid:
                for name in expected.columns:
                    if not _np.allclose(got[name].to_numpy(),expected[name].to_numpy()):valid=False
            if valid and num_out(len(expected)):
                report['table']=got.head(8).to_dict('records')
                return True,'Region table verified.'
            return False,'Create labels from image > threshold, then a DataFrame from regionprops_table for label, area and mean_intensity.'
        if lesson=='segmentation_precision':
            p=ns['predicted'];r=ns['reference']
            tp=int((p&r).sum());fp=int((p&~r).sum());fn=int((~p&r).sum());precision=tp/(tp+fp);recall=tp/(tp+fn)
            values=output.split()
            printed=len(values)==2 and good_number(numeric(values[0]),round(precision,2),.011) and good_number(numeric(values[1]),round(recall,2),.011)
            valid=all(ns.get(k)==v for k,v in [('tp',tp),('fp',fp),('fn',fn)]) and good_number(ns.get('precision'),precision) and good_number(ns.get('recall'),recall)
            return printed and valid,'Compute TP, FP and FN using both masks; precision and recall have different denominators.'
        if lesson=='imaging_pipeline':
            from skimage import morphology,measure
            fun=ns.get('quantify');img=ns['image'];thr=case['threshold'];minimum=case['min_size'];scale=case['pixel_size_um']
            if not callable(fun):return False,'Define quantify(image,threshold,min_size,pixel_size_um).';
            mask=img>thr;clean=morphology.remove_small_objects(mask,min_size=minimum);count=int(measure.label(clean,connectivity=2).max());area=float(clean.sum())*scale**2
            result=fun(img,thr,minimum,scale)
            valid=isinstance(result,dict) and result.get('regions')==count and good_number(result.get('area_um2'),area,.0001) and num_out(count)
            if valid:report['mask']=clean.astype('uint8').tolist();report['table']=[result]
            return valid,'Return measured candidate-region count and scaled area from the function arguments.'
        if lesson=='csv_import':
            import pandas as pd
            from io import StringIO
            expected=pd.read_csv(StringIO(case['csv_text']));got=ns.get('df')
            if isinstance(got,pd.DataFrame) and got.equals(expected) and num_out(len(expected)):
                report['table']=got.head(8).to_dict('records');return True,'CSV parsed.'
            return False,'Read the entire CSV text with pd.read_csv(StringIO(csv_text)).'
        if lesson=='clean_ids':
            want=[s.strip().upper() for s in case['sample_ids']]
            return ns.get('clean_ids')==want and num_out(len(set(want))),'Strip and uppercase all IDs. Count distinct normalized identifiers.'
        if lesson=='schema_missing':
            want=[r['sample_id'] for r in case['rows'] if r.get('condition') is None]
            return ns.get('invalid_ids')==want and num_out(len(want)),'Collect every sample_id with a missing or None condition.'
        if lesson=='duplicate_ids':
            import pandas as pd
            target=pd.DataFrame(case['rows']);got=ns.get('df');n=int(target['sample_id'].duplicated().sum())
            return isinstance(got,pd.DataFrame) and got.equals(target) and ns.get('duplicates')==n and num_out(n),'Count sample_id duplicates with duplicated(), excluding first occurrences.'
        if lesson=='batch_normalize':
            import pandas as pd
            target=pd.DataFrame(case['rows']);controls=target[target['condition']=='control'].groupby('batch')['signal'].mean()
            want=target['signal']/target['batch'].map(controls);got=ns.get('df')
            valid=(isinstance(got,pd.DataFrame) and 'normalized' in got.columns and _np.allclose(got['normalized'],want,rtol=1e-8,atol=1e-8))
            expected=float(want[target['condition']=='treated'].mean())
            if valid:report['table']=got.head(8).to_dict('records')
            return valid and num_out(round(expected,3),.0011),'Normalize each row to its own batch control mean. Print treated normalized average.'
        if lesson=='paired_change':
            import pandas as pd
            target=pd.DataFrame(case['rows']).pivot(index='pair_id',columns='condition',values='signal');delta=target['treated']-target['control']
            got=ns.get('wide');value=ns.get('delta')
            valid=(isinstance(got,pd.DataFrame) and got.equals(target) and isinstance(value,pd.Series) and value.equals(delta))
            if valid:report['table']=[{'pair_id':str(k),'difference':float(v)} for k,v in delta.items()]
            return valid and num_out(round(float(delta.mean()),2),.011),'Pivot by pair_id; subtract control from treated within each biological pair.'
        if lesson=='bio_replicate_n':
            import pandas as pd
            target=pd.DataFrame(case['rows']).groupby('condition')['bio_rep'].nunique().to_dict();got=ns.get('n_bio')
            return isinstance(got,dict) and got==target and num_out(target['treated']),'Count unique biological specimens using nunique(), not microscope fields.'
        if lesson=='standard_error':
            values=_np.asarray(case['values'],dtype=float);expected=float(_np.std(values,ddof=1)/_np.sqrt(len(values)))
            return good_number(ns.get('sem'),expected) and num_out(round(expected,3),.0011),'SEM needs sample SD (ddof=1) divided by sqrt(number of independent replicates).'
        if lesson=='confidence_interval':
            from scipy import stats
            v=_np.asarray(case['values'],dtype=float);mean=float(v.mean());sem=float(stats.sem(v));low,high=stats.t.interval(.95,df=len(v)-1,loc=mean,scale=sem)
            got=output.split();printed=len(got)==2 and good_number(numeric(got[0]),round(low,2),.011) and good_number(numeric(got[1]),round(high,2),.011)
            return printed and good_number(ns.get('mean'),mean) and good_number(ns.get('sem'),sem) and good_number(ns.get('lower'),low) and good_number(ns.get('upper'),high),'Use the independent-replicate mean, SEM and t distribution with df=n-1.'
        if lesson=='robust_median':
            target=float(_np.median(case['values']))
            return good_number(ns.get('median_signal'),target) and num_out(round(target,1),.011),'Use the median, not the mean, and round only for printing.'
        if lesson=='errorbar_plot':
            import matplotlib.pyplot as plt
            from matplotlib.container import ErrorbarContainer
            ax=ns.get('ax');fig=ns.get('fig')
            if ax is None or fig is None or ax.figure is not fig:return False,'Create fig,ax with plt.subplots().'
            errorbars=[c for c in ax.containers if isinstance(c,ErrorbarContainer) and c.has_yerr]
            if not errorbars:return False,'Use ax.errorbar with the supplied errors as yerr.'
            markerline=errorbars[0].lines[0];y_values=_np.asarray(markerline.get_ydata(),dtype=float)
            if not _np.allclose(y_values,case['means']):return False,'Use both supplied group means for the markers.'
            segments=errorbars[0].lines[2][0].get_segments()
            got_errors=[abs(s[1,1]-s[0,1])/2 for s in segments]
            valid=(_np.allclose(got_errors,case['errors'],atol=.001) and ax.get_ylabel().strip()!=''
               and all(k in [x.get_text() for x in ax.get_xticklabels()] for k in ('control','treated')))
            if valid:report['table']=[{'condition':label,'mean':float(m),'sem':float(e)} for label,m,e in zip(('control','treated'),case['means'],case['errors'])]
            return valid and num_out(2),'Plot actual means, yerr uncertainties, group names and a y-axis label.'
        if lesson=='reproducible_report':
            import pandas as pd
            fun=ns.get('summarize_experiment')
            if not callable(fun):return False,'Define summarize_experiment(rows).';
            expected_df=pd.DataFrame(case['rows']);rep=expected_df.groupby(['condition','bio_rep'])['signal'].mean();by=rep.groupby(level='condition').mean();cnt=rep.groupby(level='condition').size()
            diff=round(float(by['treated']-by['control']),2);want={'control_n':int(cnt['control']),'treated_n':int(cnt['treated']),'difference':diff}
            got=fun(case['rows']);valid=(isinstance(got,dict) and got.get('control_n')==want['control_n'] and got.get('treated_n')==want['treated_n'] and good_number(got.get('difference'),diff))
            if valid:report['table']=[got]
            return valid and num_out(diff,.011),'Summarize fields within biological replicates before comparing conditions.'
        if lesson=='reverse_complement':
            mapping={'A':'T','T':'A','C':'G','G':'C'};seq=case['sequence'];expected=''.join(mapping[b] for b in seq[::-1]);fun=ns.get('reverse_complement')
            return callable(fun) and fun(seq)==expected and output==expected,'Complement and reverse each changing DNA sequence.'
        if lesson=='fasta_parse':
            from Bio import SeqIO
            from io import StringIO
            expected=list(SeqIO.parse(StringIO(case['fasta_text']),'fasta'));got=ns.get('records')
            valid=(isinstance(got,list) and len(got)==len(expected) and [(r.id,str(r.seq)) for r in got]==[(r.id,str(r.seq)) for r in expected])
            return valid and num_out(len(expected)),'Parse FASTA with SeqIO.parse(StringIO(fasta_text),"fasta").'
        if lesson=='trim_quality':
            seq,qual,minimum=case['sequence'],case['quality'],case['minimum'];end=len(seq)
            while end>0 and (ord(qual[end-1])-33)<minimum:end-=1
            expected=seq[:end]
            return ns.get('trimmed')==expected and output==expected,'Remove only the low-quality 3-prime suffix using Phred+33 scores.'
        if lesson=='fastq_qc':
            from Bio import SeqIO
            from io import StringIO
            records=list(SeqIO.parse(StringIO(case['fastq_text']),'fastq'))
            want=[r.id for r in records if sum(r.letter_annotations['phred_quality'])/len(r)>=case['minimum']]
            return ns.get('kept_ids')==want and num_out(len(want)),'Parse FASTQ and filter on the mean per-read Phred quality.'
        if lesson=='kmer_counts':
            seq=case['sequence'];k=case['k'];want={}
            for i in range(len(seq)-k+1):want[seq[i:i+k]]=want.get(seq[i:i+k],0)+1
            return ns.get('counts')==want and num_out(max(want.values())),'Count every overlapping k-mer and print the maximum frequency.'
        if lesson=='read_coverage':
            target=_np.zeros(case['reference_length'],dtype=int)
            for start in case['starts']:target[start:start+case['read_length']]+=1
            return full_array(ns.get('coverage'),target,'iu') and num_out(int((target>0).sum())),'Increment coverage for every aligned read and count covered positions.'
        if lesson=='count_cpm':
            c=_np.asarray(case['counts'],dtype=float);want=c/c.sum()*1e6
            return full_array(ns.get('cpm'),want,'f') and num_out(round(float(want[0]),1),.11),'Normalize each feature count to one million total counts.'
        if lesson=='puncta_peaks':
            from scipy import ndimage as ndi
            img=ns['image'];mask=(img==ndi.maximum_filter(img,size=3))&(img>case['threshold'])
            valid=full_array(ns.get('peaks'),mask,'b') and num_out(int(mask.sum()))
            if valid:report['mask']=mask.astype('uint8').tolist()
            return valid,'Compute a true Boolean local-maximum mask. These are candidates, not validated puncta.'
        if lesson=='track_displacement':
            want=[float(_np.hypot(r1-r0,c1-c0)*case['pixel_size_um']) for r0,c0,r1,c1 in case['tracks']];got=ns.get('displacements')
            return isinstance(got,list) and len(got)==len(want) and all(good_number(a,b) for a,b in zip(got,want)) and num_out(round(float(_np.mean(want)),2),.011),'Use hypot of coordinate differences and the supplied pixel size for every track.'
        if lesson=='group_safe_split':
            from sklearn.model_selection import GroupShuffleSplit
            splitter=GroupShuffleSplit(n_splits=1,test_size=.3,random_state=case['seed']);target_train,target_test=next(splitter.split(case['X'],case['y'],case['groups']))
            a,b=ns.get('train_idx'),ns.get('test_idx')
            if a is None or b is None:return False,'Store train_idx and test_idx from GroupShuffleSplit.'
            groups=_np.asarray(case['groups']);valid=(_np.array_equal(a,target_train) and _np.array_equal(b,target_test) and not(set(groups[a]) & set(groups[b])))
            return valid and num_out(len(target_test)),'Split by biological-replicate groups, not by individual image fields.'
        if lesson=='ml_classifier':
            from sklearn.linear_model import LogisticRegression
            expected=LogisticRegression(max_iter=1000).fit(case['X_train'],case['y_train']).predict(case['X_test']);got=ns.get('predictions');model=ns.get('model')
            valid=(isinstance(model,LogisticRegression) and hasattr(model,'coef_') and isinstance(got,_np.ndarray) and _np.array_equal(got,expected))
            return valid and output==str(expected.tolist()),'Fit logistic regression on training features and predict the held-out features.'
        if lesson=='final_research_pipeline':
            from skimage import morphology,measure
            fun=ns.get('pipeline')
            if not callable(fun):return False,'Define pipeline(image,meta,threshold,min_size).';
            img=ns['image'];mask=img>case['threshold'];clean=morphology.remove_small_objects(mask,min_size=case['min_size'])
            expected={'sample_id':case['meta']['sample_id'],'bio_rep':case['meta']['bio_rep'],'condition':case['meta']['condition'],'regions':int(measure.label(clean,connectivity=2).max()),'area_um2':round(float(clean.sum())*case['meta']['pixel_size_um']**2,3)}
            got=fun(img,case['meta'],case['threshold'],case['min_size']);valid=isinstance(got,dict) and all(got.get(k)==v if k!='area_um2' else good_number(got.get(k),v,.0001) for k,v in expected.items())
            if valid:report['mask']=clean.astype('uint8').tolist();report['table']=[got]
            return valid and num_out(expected['regions']),'Return all five fields using the current image and supplied sample metadata.'
        return False,'Unknown extended task.'
    except Exception as err:
        return False,'Check Python variables and output types: '+str(err)[:180]

def check(lesson, namespace, report, case):
    output = report['output'].strip()
    if lesson in ADVANCED_LESSONS:
        return check_advanced(lesson,namespace,report,case)
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
        if lesson in ADVANCED_LESSONS or lesson in ('shape', 'pixel', 'mask', 'roi_crop', 'roi_mean', 'bright_fraction', 'background_subtract', 'intensity_hist', 'candidate_regions', 'field_report', 'table', 'group', 'plot', 'missing_records', 'join_metadata', 'replicate_means'):
            import numpy as np
            namespace['np'] = np
            if 'image' in case:
                namespace['image'] = np.asarray(case['image'], dtype=np.uint8)
        if lesson in ADVANCED_PANDAS or lesson in ('table', 'group', 'plot', 'missing_records', 'join_metadata', 'replicate_means'):
            import pandas as pd
            namespace['pd']=pd
        if lesson=='plot' or lesson in ADVANCED_PLOT:
            import matplotlib
            matplotlib.use('Agg')
            import matplotlib.pyplot as plt
            plt.close('all')
            namespace['plt']=plt
        if lesson in ADVANCED_SCIPY or lesson in ('candidate_regions', 'field_report'):
            from scipy import ndimage as ndi
            namespace['ndi']=ndi
        if lesson in ADVANCED_IMAGE and lesson=='axis_selection':
            namespace['stack']=np.asarray(case['stack'],dtype=np.uint8)
        if lesson=='segmentation_precision':
            namespace['predicted']=np.asarray(case['predicted'],dtype=bool)
            namespace['reference']=np.asarray(case['reference'],dtype=bool)
        if lesson in ADVANCED_SKIMAGE:
            from skimage import morphology,measure
            namespace.update({'morphology':morphology,'measure':measure})
        if lesson in ADVANCED_BIOPYTHON:
            from Bio import SeqIO
            namespace['SeqIO']=SeqIO
        if lesson in ADVANCED_SKLEARN:
            from sklearn.model_selection import GroupShuffleSplit
            from sklearn.linear_model import LogisticRegression
            namespace.update({'GroupShuffleSplit':GroupShuffleSplit,'LogisticRegression':LogisticRegression})
        if lesson in ('csv_import','fasta_parse','fastq_qc'):
            namespace['StringIO']=io.StringIO
        if lesson=='confidence_interval':
            from scipy import stats
            namespace['stats']=stats
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
        if (lesson=='plot' or lesson in ADVANCED_PLOT) and number==0 and make_plot:
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
# v3 pilot: browser and CPython use this same evaluator and trusted task specs.
def pilot_feedback(error):
    explanations = {
        'NameError': 'Check the spelling and assignment of the name on the reported line. Quoted text is different from a variable.',
        'TypeError': 'Inspect the value types on this line and the arguments expected by the function.',
        'AttributeError': 'This object does not provide that attribute. Check its type and the conversion you intended.',
        'IndexError': 'The index is outside this input. Python starts list indexing at zero; check the list length.',
        'ZeroDivisionError': 'The denominator is zero for this input. Decide how this edge case should be handled.',
        'SyntaxError': 'Check the indicated line for a missing colon, bracket, quote, or indentation.'}
    return explanations.get(type(error).__name__, 'Read the failing line and exception, then compare the operation with the task.')

def pilot_evaluate(source, spec, example=False):
    if not isinstance(source,str) or not source.strip() or len(source)>5000:
        return {'ok':False,'message':'Write 1–5,000 characters of Python first.','cases':[]}
    try:
        tree = ast.parse(source, '<training>')
    except SyntaxError as error:
        return {'ok':False,'message':f'SyntaxError on line {error.lineno}: {error.msg}. '+pilot_feedback(error),'cases':[]}
    nodes = list(ast.walk(tree))
    if len(nodes)>500 or any(isinstance(n,(ast.ClassDef,ast.AsyncFunctionDef,ast.Global,ast.Nonlocal,ast.With,ast.Try)) for n in nodes):
        return {'ok':False,'message':'Use short, direct statements and functions for this activity.','cases':[]}
    if any(isinstance(n,ast.Attribute) and n.attr.startswith('_') and n.attr != '__name__' for n in nodes) or any(isinstance(n,ast.Name) and n.id.startswith('__') for n in nodes):
        return {'ok':False,'message':'Python internal attributes are outside this activity.','cases':[]}
    def number(actual,expected):
        return type(actual) in (int,float) and abs(actual-expected)<1e-7
    def printed_number(output,expected):
        try: return abs(float(output.strip())-expected)<1e-7
        except (TypeError,ValueError): return False
    def has_node(tree,kind): return any(isinstance(n,kind) for n in ast.walk(tree))
    cases=spec['cases']
    if not cases: return {'ok':False,'message':'Activity inputs are missing. Reload the page.','cases':[]}
    reports=[]
    for index,original in enumerate(cases):
        import copy
        case=copy.deepcopy(original)
        # Separate copies keep mutations in learner code from changing oracle inputs.
        ns={'__builtins__':{**BUILTINS,'type':type,'help':help}}
        ns.update(copy.deepcopy(case))
        for key,kind in spec.get('input_types',{}).items():
            if kind == 'float': ns[key] = float(ns[key])
        stream=io.StringIO();counter=[0]
        def tracer(frame,event,arg):
            if event=='line' and frame.f_code.co_filename=='<training>':
                counter[0]+=1
                if counter[0]>3000: raise ValueError('Too many code steps. Check for a loop that never finishes.')
            return tracer
        report={'input_index':index,'output':'','error':None}
        try:
            sys.settrace(tracer)
            with contextlib.redirect_stdout(stream): exec(compile(tree,'<training>','exec'),ns,ns)
        except Exception as error:
            lines=[f'  line {f.lineno}: {f.line or source.splitlines()[f.lineno-1]}' for f in traceback.extract_tb(error.__traceback__) if f.filename=='<training>']
            report['error']='Traceback (most recent call last):\n'+'\n'.join(lines)+'\n'+type(error).__name__+': '+str(error)[:250]
            report['explanation']=pilot_feedback(error)
        finally: sys.settrace(None)
        output=stream.getvalue()[:4000];report['output']=output;reports.append(report)
        if report['error']:
            return {'ok':False,'message':report['explanation'],'cases':reports}
        if not example:
            try:
                env=dict(ns=ns,case=case,output=output,tree=tree,ast=ast,number=number,printed_number=printed_number,has_node=has_node)
                if 'numpy' in sys.modules: env['np']=sys.modules['numpy']
                for check in spec['checks']:
                    if not eval(check,env):
                        return {'ok':False,'message':f'Check {index+1} did not match the requested behavior. '+spec.get('feedback','Re-read the task and test the boundary or changed input.'),'cases':reports}
            except Exception:
                return {'ok':False,'message':f'Check {index+1} could not inspect the requested result. Create every named result in the task and print it as requested.','cases':reports}
    return {'ok':True,'message':'Example executed.' if example else f'Passed {len(reports)} changed-input and edge checks.','cases':reports}

def pilot_json(source,spec_json,example):
    return json.dumps(pilot_evaluate(source,json.loads(spec_json),example))

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
  try { return await runtimePromise; } catch (error) { runtimePromise = null; loaded.clear(); throw error; }
}
async function loadForLesson(py,lesson) {
  const need = [];
  const extendedLessons = ["dtype_conversion", "axis_selection", "pixel_area", "percentile_mask", "gaussian_smooth", "percentile_background", "morphological_open", "skimage_label", "remove_small", "region_table", "segmentation_precision", "imaging_pipeline", "csv_import", "clean_ids", "schema_missing", "duplicate_ids", "batch_normalize", "paired_change", "bio_replicate_n", "standard_error", "confidence_interval", "robust_median", "errorbar_plot", "reproducible_report", "reverse_complement", "fasta_parse", "trim_quality", "fastq_qc", "kmer_counts", "read_coverage", "count_cpm", "puncta_peaks", "track_displacement", "group_safe_split", "ml_classifier", "final_research_pipeline"];
  const group = {
    numpy: extendedLessons,
    pandas: ["region_table", "csv_import", "duplicate_ids", "batch_normalize", "paired_change", "bio_replicate_n", "reproducible_report"],
    scipy: ["gaussian_smooth", "morphological_open", "confidence_interval", "puncta_peaks"],
    'scikit-image': ["skimage_label", "remove_small", "region_table", "imaging_pipeline", "final_research_pipeline"],
    biopython: ["fasta_parse", "fastq_qc"],
    'scikit-learn': ["group_safe_split", "ml_classifier"],
    matplotlib: ["errorbar_plot"]
  };
  for (const [pkg,ids] of Object.entries(group)) {
    if (ids.includes(lesson) && !loaded.has(pkg)) need.push(pkg);
  }
  if (["shape","pixel","mask","roi_crop","roi_mean","bright_fraction","background_subtract","intensity_hist","candidate_regions","field_report","table","group","plot","missing_records","join_metadata","replicate_means"].includes(lesson) && !loaded.has('numpy')) need.push('numpy');
  if (["table","group","plot","missing_records","join_metadata","replicate_means"].includes(lesson) && !loaded.has('pandas')) need.push('pandas');
  if (lesson==='plot' && !loaded.has('matplotlib')) need.push('matplotlib');
  if (["candidate_regions","field_report"].includes(lesson) && !loaded.has('scipy')) need.push('scipy');
  if(need.length){
    sendStatus('Loading scientific Python packages: '+need.join(', ')+'…');
    await py.loadPackage([...new Set(need)]);
    for (const name of need) loaded.add(name);
  }
}
let pilotCatalog = null;
async function runPilot(payload) {
  const {requestId,activity,stage,source} = payload;
  if (!pilotCatalog) {
    const response = await fetch('./curriculum/v3_pilot.json');
    if (!response.ok) throw new Error('Activity catalog unavailable. Reload and retry.');
    pilotCatalog = await response.json();
  }
  const item = pilotCatalog.activities.find(a => a.id === activity);
  if (!item || !['run','modify','write','debug','transfer'].includes(stage)) throw new Error('Unknown pilot activity or stage.');
  const py = await loadRuntime();
  if (['037','038'].includes(item.number) && !loaded.has('numpy')) {
    sendStatus('Loading NumPy…'); await py.loadPackage('numpy'); loaded.add('numpy');
  }
  const spec = stage === 'run' ? {cases:[item.example.case],checks:[],input_types:item.example.input_types||{}} : stage==='transfer' ? item.transfers[payload.reviewIndex] : item.stages[stage];
  if(!spec)throw new Error('No fresh transfer prompt is available.');
  py.globals.set('pilot_source',stage === 'run' ? item.example.source : source);
  py.globals.set('pilot_spec',JSON.stringify(spec));
  py.globals.set('pilot_example',stage === 'run');
  const result = py.runPython('pilot_json(pilot_source, pilot_spec, pilot_example)');
  postMessage({type:'result',requestId,...JSON.parse(result)});
}
onmessage=async event => {
  if (event.data?.type === 'pilot') {
    try { await runPilot(event.data); }
    catch (error) { postMessage({type:'error',requestId:event.data.requestId,message:String(error?.message||error)}); }
    return;
  }
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