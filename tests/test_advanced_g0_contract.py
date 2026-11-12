"""G0 inventory regression: preserve the 26-chapter foundation on advancement branches."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TRACKS = {"P": (6, 36), "I": (13, 91), "N": (4, 17), "L": (3, 12)}


def test_all_frozen_chapters_still_exist_with_unique_competencies():
    total = []
    for prefix, (chapters, skills) in TRACKS.items():
        section = []
        for index in range(1, chapters + 1):
            id_ = f"{prefix}{index:02d}"
            file = ROOT / "content" / id_.lower() / "lesson.json"
            assert file.is_file(), f"Missing foundation chapter {id_}"
            chapter = json.loads(file.read_text(encoding="utf-8"))
            assert chapter["chapter_id"] == id_, id_
            assert chapter["goals"], id_
            assert chapter["capstone"], id_
            assert chapter["review"], id_
            section.extend(str(value) for value in chapter["competencies"])
        assert len(section) == skills, (prefix, len(section), skills)
        total.extend(section)
    assert len(total) == 156
    assert len(set(total)) == 156
    assert set(total) == {f"{i:03d}" for i in range(1, 157)}


def test_advanced_files_do_not_shadow_frozen_progress_contract():
    bridge = (ROOT / "src" / "course-adapter.js").read_text(encoding="utf-8")
    assert 'const KEYS=Object.fromEntries(IDS.map(id=>[id,"biopython."+id.toLowerCase()+".v1"]));' in bridge
    assert "localStorage" in bridge
    index = (ROOT / "docs" / "ADVANCEMENT_TRACK_V1.md").read_text(encoding="utf-8")
    assert "No modification of existing" in index
    assert "No production/main merge" in index
    assert "G0" in index and "G1" in index


def test_no_existing_lesson_files_are_in_new_advanced_folder():
    root = ROOT / "projects" / "advanced"
    assert root.is_dir()
    for path in root.rglob("*.json"):
        if "lesson" in path.name.lower():
            raise AssertionError(f"Advanced data must not replace frozen lessons: {path}")
