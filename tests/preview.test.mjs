import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { MISSIONS, STAGES, primarySource } from "../src/course.js";

test("future lesson source files are preserved and source mapping stays valid", () => {
  assert.deepEqual(STAGES, ["Python", "Microscopy", "NGS", "ML"]);
  assert.equal(MISSIONS.length, 18);
  assert.equal(new Set(MISSIONS.map(m => m.id)).size, MISSIONS.length);
  for (const mission of MISSIONS) assert.ok(primarySource(m).startsWith("https://"));
});
test("UI-first default page includes both adaptive workspaces and no loaded lesson content", () => {
  const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
  for (const item of [
    'data-stage="Python"', 'data-stage="Microscopy"', 'data-stage="NGS"',
    'data-stage="ML"', 'id="phase-panel"', 'data-phase="learn"',
    'data-phase="apply"', 'data-phase="prove"', 'id="code-editor"',
    'id="image-panel"', 'id="image-upload"', 'id="preview-image"',
    'id="reference-panel"', 'id="result-panel"', 'id="run-button"'
  ]) assert.ok(html.includes(item), "Missing expected interface: " + item);
  assert.ok(html.includes('id="run-button" class="run-button" disabled'), "Execution must stay disabled");
  assert.ok(html.includes("No lessons loaded yet."), "The empty content state should be explicit");
  assert.ok(!html.includes('src="./src/main.js"'), "The old lesson-driven app should not run");
});
test("editor drafts have a separate storage namespace; there is no fake execution", () => {
  const ui = fs.readFileSync(new URL("../src/studio-ui.js", import.meta.url), "utf8");
  assert.ok(ui.includes("biopython.ui-shell.drafts.v1"));
  assert.ok(ui.includes("localStorage.setItem"));
  assert.ok(ui.includes("previewFile"));
  assert.ok(ui.includes("setReference"));
  assert.ok(ui.includes("setPhase"));
  assert.ok(!ui.includes("eval("));
  assert.ok(!ui.includes("pyodide.runPython"));
});
test("original blueprint and source ledger remain available for later content work", () => {
  for (const name of ["docs/PRODUCT_BLUEPRINT.md", "docs/SOURCE_LEDGER.md", "README.md"])
    assert.ok(fs.statSync(new URL("../" + name, import.meta.url)).size > 1000);
});
