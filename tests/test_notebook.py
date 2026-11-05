"""Companion notebook should run top-to-bottom with a real-like decoded JPEG.
Only the HPA network transfer is replaced; the analysis executes without mocking.
"""
from pathlib import Path
from unittest.mock import patch
import tempfile, os, io, json, hashlib
import nbformat
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]

def test_notebook_runs_end_to_end_with_reproducible_outputs():
    notebook=nbformat.read(ROOT/'notebooks'/'BioPython_Research_Companion.ipynb',as_version=4)
    assert len(notebook.cells)>=20
    image=np.random.default_rng(19).integers(0,65,(512,512,3),dtype=np.uint8)
    rr,cc=np.ogrid[:512,:512]
    for r,c in [(45,70),(105,125),(170,200),(75,210)]:
        image[((rr-r)**2+(cc-c)**2)<14**2,2]=224
    buf=io.BytesIO();Image.fromarray(image).save(buf,'JPEG',quality=95)
    class FakeResponse:
        content=buf.getvalue()
        def raise_for_status(self):pass
    assert len(FakeResponse.content)>50000
    kernel={}
    cwd=os.getcwd()
    with tempfile.TemporaryDirectory() as tempdir:
        os.chdir(tempdir)
        try:
            with patch('requests.get',return_value=FakeResponse()):
                for i,cell in enumerate(notebook.cells):
                    if cell.cell_type=='code':
                        exec(compile(cell.source,f'cell-{i}','exec'),kernel,kernel)
            regions=Path('biopython_outputs/candidate_regions.csv')
            metadata=Path('biopython_outputs/provenance.json')
            assert regions.exists() and metadata.exists()
            meta=json.loads(metadata.read_text())
            assert meta['source_sha256']==hashlib.sha256(FakeResponse.content).hexdigest()
            assert meta['biological_object_count']=='not established'
            assert kernel['result']['candidate_regions'] == len(kernel['result']['regions'])
        finally:os.chdir(cwd)