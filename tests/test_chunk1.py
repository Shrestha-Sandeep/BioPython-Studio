"""Chunk 1: real CPython checks for 14 new science lessons.
Run with pytest tests/test_harness.py tests/test_chunk1.py. No network required.
"""
from pathlib import Path
import re
import pytest
import numpy as np
import pandas as pd
from scipy import ndimage as ndi

worker=(Path(__file__).resolve().parents[1]/'worker.js').read_text()
harness=re.search(r'const HARNESS = String\.raw`([\s\S]*?)`;\s*let runtimePromise',worker)
assert harness, 'Python evaluator missing'
ns={}
exec(harness.group(1),ns)
evaluate=ns['evaluate']

im1=np.zeros((40,48),dtype=np.uint8)
im1[3:11,7:13]=210
im1[14:21,24:29]=255
im1[28:32,2:6]=169
im2=(np.arange(56*54,dtype=np.int32).reshape(56,54)*7 % 256).astype(np.uint8)
im3=np.zeros((48,52),dtype=np.uint8)
im3[9:17,10:18]=180
im3[30:39,31:38]=220
im3[12:15,40:43]=150
images=[im1,im2,im3]
meta=['CTRL-W07-R2','TREATED-W08-R3','RECOVERY-W13-R1']

def image_cases(extras):
 return [{'image':im.tolist(),**extras[i]} for i,im in enumerate(images)]

crops=[{'r0':4,'r1':23,'c0':5,'c1':36},{'r0':6,'r1':31,'c0':7,'c1':29},{'r0':10,'r1':34,'c0':4,'c1':28}]
thresholds=[{'threshold':100},{'threshold':170},{'threshold':50}]
backgrounds=[{'background':20},{'background':80},{'background':14}]
miss=[{'rows':[{'sample_id':'A','bright_pixels':0},{'sample_id':'B','bright_pixels':None},{'sample_id':'C','bright_pixels':13}]},
      {'rows':[{'sample_id':'D','bright_pixels':None},{'sample_id':'E','bright_pixels':16},{'sample_id':'F','bright_pixels':12}]},
      {'rows':[{'sample_id':'G','bright_pixels':44},{'sample_id':'H','bright_pixels':None},{'sample_id':'I','bright_pixels':0}]}]
joins=[{'measurements':[{'sample_id':'A','field':1,'bright_pixels':5},{'sample_id':'A','field':2,'bright_pixels':10},{'sample_id':'B','field':1,'bright_pixels':7}], 'metadata':[{'sample_id':'A','condition':'control'},{'sample_id':'B','condition':'treated'}]},
       {'measurements':[{'sample_id':'D','field':1,'bright_pixels':5},{'sample_id':'C','field':1,'bright_pixels':2}], 'metadata':[{'sample_id':'C','condition':'base'},{'sample_id':'D','condition':'drug'}]},
       {'measurements':[{'sample_id':'R','field':1,'bright_pixels':99},{'sample_id':'R','field':2,'bright_pixels':80}], 'metadata':[{'sample_id':'R','condition':'wash'}]}]
replicate_cases=[{'rows':[{'condition':'control','bio_rep':'C1','field':1,'bright_pixels':2},{'condition':'control','bio_rep':'C1','field':2,'bright_pixels':4},{'condition':'control','bio_rep':'C2','field':1,'bright_pixels':8},{'condition':'treated','bio_rep':'T1','field':1,'bright_pixels':12},{'condition':'treated','bio_rep':'T1','field':2,'bright_pixels':18},{'condition':'treated','bio_rep':'T2','field':1,'bright_pixels':14}]},
   {'rows':[{'condition':'control','bio_rep':'C1','field':1,'bright_pixels':100},{'condition':'control','bio_rep':'C2','field':1,'bright_pixels':50},{'condition':'control','bio_rep':'C2','field':2,'bright_pixels':60},{'condition':'treated','bio_rep':'T1','field':1,'bright_pixels':90},{'condition':'treated','bio_rep':'T2','field':1,'bright_pixels':40},{'condition':'treated','bio_rep':'T2','field':2,'bright_pixels':30}]},
   {'rows':[{'condition':'control','bio_rep':'C1','field':1,'bright_pixels':30},{'condition':'control','bio_rep':'C2','field':1,'bright_pixels':20},{'condition':'treated','bio_rep':'T1','field':1,'bright_pixels':60},{'condition':'treated','bio_rep':'T1','field':2,'bright_pixels':50},{'condition':'treated','bio_rep':'T2','field':1,'bright_pixels':75}]}]

GOOD={
 'sample_parts':('group=sample_id.split("-")[0]\nprint(group)',[{'sample_id':x} for x in meta]),
 'gc_fraction':('gc_pct=round(100*(sequence.count("G")+sequence.count("C"))/len(sequence),1)\nprint(gc_pct)',[{'sequence':'ATGCGCTA'},{'sequence':'GGGCCCAA'},{'sequence':'ATATATAA'}]),
 'quality_filter':('kept=[v for v in signals if v>=minimum]\nprint(len(kept))',[{'signals':[2,12,7,20],'minimum':8},{'signals':[0,1,2,3],'minimum':2},{'signals':[4,10,13],'minimum':10}]),
 'metadata_dict':('record={"sample_id":sample_id,"condition":condition,"bio_rep":bio_rep}\nprint(str(record["condition"])+":"+str(record["bio_rep"]))',[{'sample_id':'A','condition':'control','bio_rep':2},{'sample_id':'B','condition':'treated','bio_rep':4},{'sample_id':'D','condition':'restored','bio_rep':1}]),
 'roi_crop':('roi=image[r0:r1,c0:c1]\nprint(roi.shape)',image_cases(crops)),
 'roi_mean':('roi=image[r0:r1,c0:c1]\nmean_intensity=float(roi.mean())\nprint(round(mean_intensity,2))',image_cases(crops)),
 'bright_fraction':('mask=image>threshold\nfraction=float(mask.mean())\nprint(round(fraction,3))',image_cases(thresholds)),
 'background_subtract':('corrected=np.maximum(image.astype(np.int16)-background,0)\nprint(int(corrected.sum()))',image_cases(backgrounds)),
 'intensity_hist':('hist,edges=np.histogram(image,bins=4,range=(0,256))\nprint(int(hist[-1]))',image_cases([{}, {}, {}])),
 'candidate_regions':('mask=image>threshold\nlabels,region_count=ndi.label(mask)\nprint(region_count)',image_cases(thresholds)),
 'missing_records':('df=pd.DataFrame(rows)\nclean=df.dropna(subset=["bright_pixels"])\nprint(len(clean))',miss),
 'join_metadata':('merged=pd.DataFrame(measurements).merge(pd.DataFrame(metadata),on="sample_id",validate="many_to_one")\nprint(len(merged))',joins),
 'replicate_means':('df=pd.DataFrame(rows)\nrep_means=df.groupby(["condition","bio_rep"])["bright_pixels"].mean()\ncondition_means=rep_means.groupby(level="condition").mean()\nprint(round(float(condition_means["treated"]-condition_means["control"]),2))',replicate_cases),
 'field_report':('def analyze(sample_id,image,threshold):\n    mask=image>threshold\n    labels,n=ndi.label(mask)\n    return {"sample_id":sample_id,"bright_pixels":int(mask.sum()),"bright_fraction":round(float(mask.mean()),3),"regions":int(n)}\nresult=analyze(sample_id,image,threshold)\nprint(result["bright_pixels"])',image_cases([{**thresholds[i],'sample_id':meta[i]} for i in range(3)]))
}
BAD={
 'sample_parts':'group="CTRL"\nprint(group)',
 'gc_fraction':'gc_pct=50.0\nprint(gc_pct)',
 'quality_filter':'kept=signals[:1]\nprint(len(kept))',
 'metadata_dict':'record={"sample_id":sample_id}\nprint("control:2")',
 'roi_crop':'roi=image[:10,:10]\nprint(roi.shape)',
 'roi_mean':'roi=image[r0:r1,c0:c1]\nmean_intensity=0\nprint(round(mean_intensity,2))',
 'bright_fraction':'mask=image>100\nfraction=float(mask.mean())\nprint(round(fraction,3))',
 'background_subtract':'corrected=image-background\nprint(int(corrected.sum()))',
 'intensity_hist':'hist=np.array([1,2,3,4])\nprint(4)',
 'candidate_regions':'mask=image>threshold\nlabels=mask\nregion_count=int(mask.sum())\nprint(region_count)',
 'missing_records':'df=pd.DataFrame(rows)\nclean=df[df["bright_pixels"]>0]\nprint(len(clean))',
 'join_metadata':'merged=pd.DataFrame(measurements)\nprint(len(merged))',
 'replicate_means':'df=pd.DataFrame(rows)\nrep_means=df.groupby(["condition","bio_rep"])["bright_pixels"].mean()\ncondition_means=df.groupby("condition")["bright_pixels"].mean()\nprint(round(float(condition_means["treated"]-condition_means["control"]),2))',
 'field_report':'def analyze(sample_id,image,threshold):\n    mask=image>threshold\n    return {"sample_id":sample_id,"bright_pixels":int(mask.sum()),"bright_fraction":round(float(mask.mean()),3),"regions":int(mask.sum())}\nresult=analyze(sample_id,image,threshold)\nprint(result["bright_pixels"])'
}
assert len(GOOD)==14 and GOOD.keys()==BAD.keys()

@pytest.mark.parametrize('lesson',GOOD)
def test_correct_uses_all_changed_inputs(lesson):
    source,cases=GOOD[lesson]
    response=evaluate(lesson,source,cases,make_plot=False)
    assert response['ok'], (lesson,response)
    assert len(response['cases'])==3

@pytest.mark.parametrize('lesson',GOOD)
def test_hardcoded_or_scientifically_wrong_fails(lesson):
    cases=GOOD[lesson][1]
    response=evaluate(lesson,BAD[lesson],cases,make_plot=False)
    assert not response['ok'], (lesson,response)

@pytest.mark.parametrize('lesson',('bright_fraction','candidate_regions','field_report'))
def test_mask_visualization_is_derived_from_correct_python(lesson):
    code,cases=GOOD[lesson]
    response=evaluate(lesson,code,cases,make_plot=False)
    assert response['ok']
    mask=response['cases'][0]['mask']
    assert len(mask)==images[0].shape[0]
    assert len(mask[0])==images[0].shape[1]

@pytest.mark.parametrize('lesson',('missing_records','join_metadata','replicate_means','field_report'))
def test_tables_contain_actual_result_rows(lesson):
    code,cases=GOOD[lesson]
    response=evaluate(lesson,code,cases,make_plot=False)
    assert response['ok']
    assert isinstance(response['cases'][0]['table'],list)
    assert len(response['cases'][0]['table'])>0

def test_scipy_is_real_and_connected_regions_differ_from_bright_pixel_count():
    image=im1;mask=image>100
    assert int(mask.sum())!=int(ndi.label(mask)[1])
    response=evaluate('candidate_regions',GOOD['candidate_regions'][0],GOOD['candidate_regions'][1],make_plot=False)
    assert response['ok']

def test_scientific_imports_do_not_open_unsafe_modules():
    code='import os\nprint("hack")'
    response=evaluate('field_report',code,GOOD['field_report'][1],make_plot=False)
    assert not response['ok'] and 'ImportError' in response['message']