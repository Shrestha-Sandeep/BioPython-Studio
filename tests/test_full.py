"""61-lesson scientific course: changed-input tests and wrong-answer rejection.
Exercises in the shipped app are tested using real CPython and deterministic image fixtures;
the browser separately uses publisher-hosted HPA images.
"""
import json,re
from pathlib import Path
import numpy as np
import pytest

ROOT=Path(__file__).resolve().parents[1]
src=(ROOT/'worker.js').read_text()
match=re.search(r'const HARNESS = String\.raw`([\s\S]*?)`;\n\nlet runtimePromise',src)
assert match
space={}
exec(match.group(1),space)
evaluate=space['evaluate']
js_source=(ROOT/'app.js').read_text()
raw=js_source.split('const STUDIO_EXTENSION = ',1)[1].split(';\nlessons.push',1)[0]
ext=json.loads(raw)
GOOD=json.loads((ROOT/'tests'/'expected_solutions.json').read_text())
BAD=json.loads((ROOT/'tests'/'wrong_solutions.json').read_text())

def image_samples():
    result=[]
    for i,(H,W) in enumerate([(48,48),(52,45),(54,57)]):
        rng=np.random.default_rng(1240+i)
        img=rng.integers(0,50,(H,W),dtype=np.uint8)
        for n in range(8+i*5):
            r=int(rng.integers(4,H-4));c=int(rng.integers(4,W-4));size=2+(n%3)
            ys,xs=np.ogrid[:H,:W];img[(ys-r)**2+(xs-c)**2<=size**2]=int(rng.integers(170,248))
        result.append(img)
    return result
IMAGES=image_samples()

def get_cases(id):
    if id not in ext['image_ids']:
        return ext['cases'][id]
    answers=[]
    for i,img in enumerate(IMAGES):
        case={'image':img.tolist()}
        thr=90+i*20
        # Exercise-specific metadata corresponds to the browser's HPA-derived cases.
        if id=='axis_selection':
            case.update(stack=np.stack([img,img//2],axis=0).tolist(),frame_index=[0,1,0][i])
        if id=='pixel_area':case.update(threshold=thr,pixel_size_um=[.12,.18,.24][i])
        if id=='percentile_mask':case.update(percentile=[75,85,65][i])
        if id=='gaussian_smooth':case.update(sigma=[.7,1.3,2.0][i])
        if id=='percentile_background':case.update(percentile=[10,18,30][i])
        if id in ['morphological_open','skimage_label','remove_small','region_table','imaging_pipeline','puncta_peaks','final_research_pipeline']:
            case['threshold']=thr
        if id=='remove_small':case['min_size']=[4,12,20][i]
        if id=='imaging_pipeline':case.update(min_size=[4,12,8][i],pixel_size_um=[.12,.18,.24][i])
        if id=='final_research_pipeline':case.update(min_size=[4,12,8][i],meta={'sample_id':f'SPEC_{i}','bio_rep':f'R{i+1}','condition':['control','treated','recovery'][i],'pixel_size_um':[.12,.18,.24][i]})
        answers.append(case)
    return answers

@pytest.mark.parametrize('lesson',GOOD)
def test_real_python_correct_solution_on_three_changed_cases(lesson):
    res=evaluate(lesson,GOOD[lesson],get_cases(lesson),make_plot=False)
    assert res['ok'],(lesson,res.get('message'),res.get('cases'))
    assert len(res['cases'])==3

@pytest.mark.parametrize('lesson',GOOD)
def test_plausible_incorrect_solution_rejected(lesson):
    res=evaluate(lesson,BAD[lesson],get_cases(lesson),make_plot=False)
    assert not res['ok'],(lesson,res)

@pytest.mark.parametrize('lesson',('pixel_area','percentile_mask','morphological_open','skimage_label','remove_small','puncta_peaks','final_research_pipeline'))
def test_visual_image_mask_comes_from_python(lesson):
    res=evaluate(lesson,GOOD[lesson],get_cases(lesson),make_plot=False)
    assert res['ok'],(lesson,res.get('message'))
    assert len(res['cases'][0]['mask'])==len(IMAGES[0])

@pytest.mark.parametrize('lesson',('region_table','csv_import','batch_normalize','paired_change','errorbar_plot','reproducible_report','imaging_pipeline','final_research_pipeline'))
def test_scientific_output_contains_tabular_data(lesson):
    res=evaluate(lesson,GOOD[lesson],get_cases(lesson),make_plot=False)
    assert res['ok'],(lesson,res.get('message'))
    assert isinstance(res['cases'][0]['table'],list)
    assert res['cases'][0]['table']

def test_source_keeps_previous_skills_and_references():
    js=(ROOT/'app.js').read_text()
    assert 'STUDIO_EXTENSION' in js
    assert 'STORAGE_KEY = \'biopython_studio_personal_v1\'' in js
    assert len(ext['lessons'])==36
    assert len({r['id'] for r in ext['lessons']})==36
    assert all(len(ext['guides'][r['id']]['steps'])==3 for r in ext['lessons'])
    assert len(ext['image_ids'])==13
    assert 'https://www.pythonforbiologists.org/' in js
    assert 'https://bioimagebook.github.io/' in js
    assert 'https://haesleinhuepf.github.io/BioImageAnalysisNotebooks/' in js



def test_matplotlib_errorbar_figure_is_actually_exported():
    result=evaluate('errorbar_plot',GOOD['errorbar_plot'],get_cases('errorbar_plot'),make_plot=True)
    assert result['ok'],result
    import base64
    figure=base64.b64decode(result['cases'][0].get('plot_png',''))
    assert figure.startswith(b'\x89PNG\r\n\x1a\n') and len(figure)>1000

def test_core_matplotlib_plot_still_exports_a_png():
    source='fig,ax=plt.subplots()\nax.bar(["control","treated"],[control_mean,treated_mean])\nax.set_ylabel("Bright pixels / field")'
    result=evaluate('plot',source,[{'control_mean':11,'treated_mean':17},{'control_mean':19,'treated_mean':13}],make_plot=True)
    assert result['ok'],result
    assert len(result['cases'][0].get('plot_png',''))>1000