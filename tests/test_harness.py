"""Run original BioPython Studio Python harness against independent data.

Tests run real CPython locally; they do not certify remote Pyodide delivery.
"""
from pathlib import Path
import re
import numpy as np
import pandas as pd
import pytest

WORKER = Path(__file__).resolve().parent.parent / 'worker.js'
RAW = WORKER.read_text(encoding='utf-8')
MATCH = re.search(r'const HARNESS = String\.raw`([\s\S]*?)`;\n\nlet runtimePromise',RAW)
assert MATCH, 'Python harness missing from worker.js'
namespace = {}
exec(MATCH.group(1), namespace)
evaluate = namespace['evaluate']

big_images = [(np.arange(40*48,dtype=np.uint16).reshape(40,48)%256).astype(np.uint8).tolist(),
              (np.arange(38*45,dtype=np.uint16).reshape(38,45)*3%256).astype(np.uint8).tolist()]

images = [
    np.arange(35, dtype=np.uint8).reshape(5,7).tolist(),
    np.arange(48, dtype=np.uint8).reshape(6,8).tolist(),
    (np.arange(48, dtype=np.uint8).reshape(6,8)*2).tolist(),
]

GOOD = [
 ('sample', 'print(sample_id)', [{'sample_id':'control_A01'},{'sample_id':'treated_B18'}]),
 ('change','change_pct = round((treated-control)/control*100,1)\nprint(change_pct)', [{'control':80,'treated':60},{'control':120,'treated':150}]),
 ('replicates','total=sum(counts)\nprint(total)', [{'counts':[2,3,4]},{'counts':[10,1]}]),
 ('function','def mean_signal(values):\n    return sum(values)/len(values)\nprint(round(mean_signal(signals),2))',[{'signals':[1,2,3]},{'signals':[3,6,9,12]}]),
 ('shape','print(image.shape)', [{'image':images[0]},{'image':images[1]}]),
 ('pixel','print(int(image[20,25]))', [{'image':big_images[0]},{'image':big_images[1]}]),
 ('mask','mask=image > threshold\nprint(int(mask.sum()))',[{'image':images[0],'threshold':10},{'image':images[1],'threshold':35}]),
 ('table','df=pd.DataFrame(rows)\nprint(int(df["bright_pixels"].sum()))',[{'rows':[{'sample_id':'A','bright_pixels':2},{'sample_id':'B','bright_pixels':5}]},{'rows':[{'sample_id':'C','bright_pixels':10}]}]),
 ('group','df=pd.DataFrame(rows)\nmeans=df.groupby("condition")["bright_pixels"].mean()\nprint(round(float(means["treated"]-means["control"]),2))',[{'rows':[{'condition':'control','bright_pixels':3},{'condition':'control','bright_pixels':5},{'condition':'treated','bright_pixels':9}]},{'rows':[{'condition':'control','bright_pixels':6},{'condition':'control','bright_pixels':4},{'condition':'treated','bright_pixels':1},{'condition':'treated','bright_pixels':3}]}]),
 ('plot','fig,ax=plt.subplots()\nax.bar(["control","treated"],[control_mean,treated_mean])\nax.set_ylabel("Bright pixels / field")',[{'control_mean':10,'treated_mean':16},{'control_mean':20,'treated_mean':13}]),
 ('transfer','def summarize(sample_id, counts):\n    total=sum(counts)\n    return {"sample_id":sample_id,"total":total,"mean":round(total/len(counts),2)}\nprint(summarize(sample_id,counts))',[{'sample_id':'A','counts':[2,4,6]},{'sample_id':'B','counts':[3,7,11,2]}]),
]

@pytest.mark.parametrize('lesson,solution,cases',GOOD,ids=[v[0] for v in GOOD])
def test_expected_original_solution_passes(lesson,solution,cases):
    result = evaluate(lesson,solution,cases,make_plot=False)
    assert result['ok'], (lesson,result)
    assert len(result['cases'])==len(cases)

BAD = [
 ('sample','print("control_A01")',[{'sample_id':'control_A01'},{'sample_id':'treated_B18'}]),
 ('change','change_pct=treated-control\nprint(change_pct)',[{'control':80,'treated':60}]),
 ('replicates','total=counts[0]\nprint(total)',[{'counts':[2,3,4]}]),
 ('function','def mean_signal(values):\n    return values[0]\nprint(mean_signal(signals))',[{'signals':[1,2,3]}]),
 ('shape','print((5,7))',[{'image':images[0]},{'image':images[1]}]),
 ('pixel','print(17)',[{'image':big_images[0]},{'image':big_images[1]}]),
 ('mask','mask=image>100\nprint(int(mask.sum()))',[{'image':images[0],'threshold':10}]),
 ('table','df=pd.DataFrame(rows)\nprint(df["bright_pixels"].iloc[0])',[{'rows':[{'sample_id':'A','bright_pixels':2},{'sample_id':'B','bright_pixels':5}]}]),
 ('group','df=pd.DataFrame(rows)\nmeans=df.groupby("condition")["bright_pixels"].mean()\nprint(0)',[{'rows':[{'condition':'control','bright_pixels':3},{'condition':'treated','bright_pixels':9}]}]),
 ('plot','fig,ax=plt.subplots()\nax.bar(["control","treated"],[control_mean,0])\nax.set_ylabel("")',[{'control_mean':10,'treated_mean':16}]),
 ('transfer','def summarize(sample_id,counts):\n    return {"sample_id":sample_id,"total":999,"mean":1}\nprint(summarize(sample_id,counts))',[{'sample_id':'A','counts':[2,4,6]}]),
]
@pytest.mark.parametrize('lesson,code,cases',BAD,ids=[v[0] for v in BAD])
def test_non_generalizing_solution_fails(lesson,code,cases):
    result = evaluate(lesson,code,cases,make_plot=False)
    assert not result['ok'], (lesson,result)


def test_invalid_syntax_is_feedback():
    result = evaluate('sample','print(',[{'sample_id':'A'}],make_plot=False)
    assert not result['ok'] and 'Syntax error' in result['message']


def test_imports_are_limited():
    result = evaluate('sample','import os\nprint(sample_id)',[{'sample_id':'A'}],make_plot=False)
    assert not result['ok'] and 'ImportError' in result['message']


def test_numpy_mask_is_returned_for_visual_overlay():
    result = evaluate('mask','mask=image > threshold\nprint(int(mask.sum()))',[{'image':images[0],'threshold':10}],make_plot=False)
    assert result['ok'] and len(result['cases'][0]['mask']) == 5


def test_table_is_returned_for_visual_display():
    result = evaluate('table','df=pd.DataFrame(rows)\nprint(int(df["bright_pixels"].sum()))',[{'rows':[{'sample_id':'A','bright_pixels':2},{'sample_id':'B','bright_pixels':5}]}],make_plot=False)
    assert result['ok'] and len(result['cases'][0]['table']) == 2


def test_real_matplotlib_plot_is_exported():
    result = evaluate('plot','fig,ax=plt.subplots()\nax.bar(["control","treated"],[control_mean,treated_mean])\nax.set_ylabel("Bright pixels / field")',[{'control_mean':10,'treated_mean':16}],make_plot=True)
    assert result['ok'] and len(result['cases'][0]['plot_png']) > 500