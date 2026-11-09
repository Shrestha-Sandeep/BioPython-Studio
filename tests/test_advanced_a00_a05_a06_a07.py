"""Actual local Python A00/A05/A06/A07 scientific controls and failure cases.

Fixtures here are *synthetic*. Real learner independence / real-data biological
validity require the separate evidence gate and direct human assessment.
"""
from __future__ import annotations

import csv
import hashlib
import json
from dataclasses import asdict
from pathlib import Path

import numpy as np
import pytest
import tifffile

from projects.advanced.a00.bridge import BridgeError, environment, inspect_sample_table
from projects.advanced.a05.analysis import AnalysisPlan, DesignError, estimate_effect, load_biological_units, run as stats_run
from projects.advanced.a06.batch import BatchError, batch_run, load_manifest
from projects.advanced.a07.evidence_check import EvidenceError, validate_evidence


def _write_csv(path: Path, names: list[str], records: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=names)
        writer.writeheader()
        writer.writerows(records)


def test_a00_real_source_integrity_errors_and_environment(tmp_path):
    inp = tmp_path / "samples.csv"
    _write_csv(inp, ["sample_id", "animal_id", "value"],
               [{"sample_id": "f01", "animal_id": "wormA", "value": "30"},
                {"sample_id": "f02", "animal_id": "wormA", "value": "50"},
                {"sample_id": "f03", "animal_id": "wormB", "value": "10"}])
    original = inp.read_bytes()
    report = inspect_sample_table(inp)
    assert report["rows"] == 3 and report["biological_animals"] == 2
    assert report["sample_mean"] == 30
    assert report["source_sha256"] == hashlib.sha256(original).hexdigest()
    assert inp.read_bytes() == original
    assert environment()["interpreter"]
    _write_csv(inp, ["sample_id", "animal_id", "value"],
               [{"sample_id": "dup", "animal_id": "A", "value": "2"},
                {"sample_id": "dup", "animal_id": "B", "value": "3"}])
    with pytest.raises(BridgeError, match="duplicate"):
        inspect_sample_table(inp)
    _write_csv(inp, ["sample_id", "animal_id", "value"],
               [{"sample_id": "id", "animal_id": "A", "value": "nan"}])
    with pytest.raises(BridgeError, match="nonfinite"):
        inspect_sample_table(inp)


def _animal_rows(design="unpaired", excluding=False):
    headers = ["animal_id", "condition", "field_id", "signal", "exclusion_reason", "pair_id"]
    rows = []
    for i in range(4):
        for condition in ("control", "treated"):
            animal = f"{condition[0]}{i}" if design == "unpaired" else f"animal{i}"
            pair = f"pair{i}" if design == "paired" else ""
            for field, value in enumerate((1+i, 3+i)):
                rows.append({"animal_id": animal, "condition": condition,
                             "field_id": f"field{field}", "signal": value+(8 if condition=="treated" else 0),
                             "exclusion_reason": "artifact" if excluding and i==0 and field==1 else "",
                             "pair_id": pair})
    return headers, rows


def test_a05_animal_unit_bootstrap_reproducible_and_no_cell_pseudoreplication(tmp_path):
    src=tmp_path/"measures.csv"
    cols, rows=_animal_rows("unpaired")
    _write_csv(src,cols,rows)
    plan=AnalysisPlan(control="control",treatment="treated",bootstrap_draws=500,seed=17)
    units,qc=load_biological_units(src,plan)
    assert len(units)==8
    assert qc["measurements_included"]==16
    assert qc["independent_group_counts"]=={"control":4,"treated":4}
    a=estimate_effect(units,plan)
    b=estimate_effect(units,plan)
    assert a==b
    assert a["difference_of_biological_unit_means"]==8.0
    assert a["independent_unit_count"]==8
    assert a["percentile_bootstrap_ci"][0] <= 8 <= a["percentile_bootstrap_ci"][1]
    out=tmp_path/"report"
    produced=stats_run(src,out,plan)
    assert produced["source_sha256"]==hashlib.sha256(src.read_bytes()).hexdigest()
    assert len((out/"animal_summary.csv").read_text().splitlines())==9
    assert (out/"analysis.json").is_file() and (out/"animal_units.png").is_file()
    with pytest.raises(DesignError,match="NEW"):
        stats_run(src,out,plan)


def test_a05_paired_bootstrap_and_integrity_errors(tmp_path):
    cols, rows=_animal_rows("paired")
    src=tmp_path/"paired.csv"
    _write_csv(src,cols,rows)
    plan=AnalysisPlan(control="control",treatment="treated",design="paired",bootstrap_draws=500)
    units,info=load_biological_units(src,plan)
    assert len(units)==8
    result=estimate_effect(units,plan)
    assert result["difference_of_biological_unit_means"]==8.0
    assert result["independent_unit_count"]==4
    assert result["bootstrap_method"]=="resample_whole_pairs"
    # Break one pair after it was created.
    broken=[r for r in rows if not (r["condition"]=="treated" and r["pair_id"]=="pair3")]
    _write_csv(src,cols,broken)
    with pytest.raises(DesignError,match="Every pair"):
        load_biological_units(src,plan)
    _write_csv(src,cols,rows+rows[:1])
    with pytest.raises(DesignError,match="duplicate"):
        load_biological_units(src,plan)
    bad=rows.copy()
    bad[0]={**bad[0],"signal":"NaN"}
    _write_csv(src,cols,bad)
    with pytest.raises(DesignError,match="nonfinite"):
        load_biological_units(src,plan)


def _batch_fixture(tmp_path):
    root=tmp_path/"inputs"
    root.mkdir()
    metadata=[]
    for i in range(6):
        animal=f"worm{i//2}"
        image=np.zeros((24,28),dtype=np.uint16)
        image[4:8,3:7]=45000+i*1000
        path=root/f"img{i:02d}.ome.tif"
        tifffile.imwrite(path,image,ome=True,metadata={"axes":"YX"})
        metadata.append({
            "image_id":f"field{i}","source_path":path.name,
            "animal_id":animal,"condition":"control" if i<4 else "treated",
            "channel":"","z":"","time":"","exclude_reason":""})
    csv_path=tmp_path/"manifest.csv"
    cols=["image_id","source_path","animal_id","condition","channel","z","time","exclude_reason"]
    _write_csv(csv_path,cols,metadata)
    config_path=tmp_path/"config.json"
    config_path.write_text(json.dumps({"segmentation":{
        "method":"manual","manual_threshold":20000,"gaussian_sigma":0,
        "min_area":4,"closing_radius":0}}),encoding="utf-8")
    return root,csv_path,config_path,metadata,cols


def test_a06_batch_source_safe_manifest_and_A05_handoff(tmp_path):
    root,man,cfg,records,cols=_batch_fixture(tmp_path)
    original={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in root.glob("*.tif")}
    out=tmp_path/"results"
    report=batch_run(data_root=root,manifest_csv=man,config_file=cfg,output_root=out)
    assert report["source_root_file_count"]==6
    assert report["included_fields"]==6
    assert len(report["images"])==6
    assert [row["candidate_count"] for row in report["images"]]==[1]*6
    assert all(row["pixel_size_independently_verified"] is False for row in report["images"])
    assert len(list((out/"masks").glob("*.tif")))==6
    assert {p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in root.glob("*.tif")}==original
    # A05 needs >=3 animals per group; the A06 export is valid CSV despite
    # only two control and one treated animal in this synthetic short fixture.
    with pytest.raises(DesignError,match="at least 3"):
        load_biological_units(out/"a05_measurements.csv",
                              AnalysisPlan(control="control",treatment="treated"))
    with pytest.raises(BatchError,match="NEW"):
        batch_run(data_root=root,manifest_csv=man,config_file=cfg,output_root=out)
    # No silent duplicate file acceptance or source directory write.
    records[1]["image_id"]=records[0]["image_id"]
    _write_csv(man,cols,records)
    with pytest.raises(BatchError,match="Duplicate image ID"):
        load_manifest(man,root)
    with pytest.raises(BatchError,match="NEW"):
        batch_run(data_root=root,manifest_csv=man,config_file=cfg,output_root=root/"outputs")


def _a07_template(root: Path):
    root.mkdir()
    plan={"biological_question":"Are annotated objects reliably counted per animal?",
          "target_definition":"Nucleus interiors defined by original reference labels",
          "inclusion_rules":"In-focus images with original metadata and full masks",
          "exclusion_rules":"Images without authentic source or annotation provenance",
          "primary_endpoint":"Per-animal candidate object count",
          "biological_unit":"animal","prespecified_acceptance":"Object F1 >=0.7 on independent holdout",
          "known_confounders":"Focus, illumination, nuclear overlap",
          "reviewed_holdout_before_freeze":False}
    (root/"project_plan.json").write_text(json.dumps(plan))
    sha=lambda seed:hashlib.sha256(seed.encode()).hexdigest()
    audits=[{"image_id":"imgA","source_sha256":sha("a"),"axes":"YX",
             "native_dtype":"uint16","scale_independently_verified":False},
            {"image_id":"imgB","source_sha256":sha("b"),"axes":"YX",
             "native_dtype":"uint16","scale_independently_verified":False}]
    (root/"source_audit.json").write_text(json.dumps({"images":audits}))
    _write_csv(root/"split_manifest.csv",
               ["image_id","biological_group_id","split","source_sha256"],
               [{"image_id":"imgA","biological_group_id":"animalA","split":"development","source_sha256":sha("a")},
                {"image_id":"imgB","biological_group_id":"animalB","split":"holdout","source_sha256":sha("b")}])
    (root/"evaluation.json").write_text(json.dumps({"holdout_images":[{
        "image_id":"imgB","tp":3,"fp":2,"fn":1,"object_f1":6/9,
        "annotation_source":"public expert instance masks",
        "annotation_rule":"interior-only, exclude ambiguous border pixels"}]}))
    (root/"reproduction.json").write_text(json.dumps({
        "source_commit":"1234567890abcdef","local_environment":"fresh venv pip-freeze.txt",
        "run_command":"python -m projects.advanced.a06.batch --config conf.json",
        "result_manifest_sha256":sha("manifest"),"fresh_checkout_executed":True,
        "source_hashes_checked":True}))
    _write_csv(root/"failure_cases.csv",["image_id","error_type","note"],[
        {"image_id":"imgB","error_type":"split",
         "note":"Two nuclei incorrectly divided into adjacent candidates"}])
    paragraph=("The biological unit is the animal rather than an individual field. "
               "Annotation uncertainty remains because the original expert labels can miss "
               "ambiguous border objects. Limitation: brightfield and fluorescence data may "
               "need different parameters. The uncertainty interval requires independent "
               "animals and a declared design. Decision: treat results as a pilot, not "
               "established generalizable biology. Source checksums are checked before "
               "analysis, and a separate held-out source is needed for an unbiased claim. ")
    (root/"methods_and_limitations.md").write_text(paragraph*5)


def test_a07_evidence_gate_is_structural_only_and_rejects_leakage(tmp_path):
    root=tmp_path/"submission"
    _a07_template(root)
    result=validate_evidence(root)
    assert result["checkpoints_structurally_present"]==7
    assert result["scientifically_validated"] is False
    assert result["independent_learner_mastery_certified"] is False
    assert result["human_review_required"] is True
    manifest=root/"split_manifest.csv"
    s=manifest.read_text()
    manifest.write_text(s.replace("animalB","animalA"))
    with pytest.raises(EvidenceError,match="leaks"):
        validate_evidence(root)
    manifest.write_text(s)
    evaluations=json.loads((root/"evaluation.json").read_text())
    evaluations["holdout_images"][0]["object_f1"]=0.99
    (root/"evaluation.json").write_text(json.dumps(evaluations))
    with pytest.raises(EvidenceError,match="Inconsistent F1"):
        validate_evidence(root)
