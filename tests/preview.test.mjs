import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const read = path => fs.readFileSync(new URL("../" + path, import.meta.url), "utf8");
test("UI-first shell has a focused IDE plus an image analysis workspace", () => {
  const html = read("index.html");
  for (const id of [
    "sidebar", "course-nav", "mode-python", "mode-image", "phase-panel",
    "code-editor", "line-numbers", "run-button", "image-panel", "image-upload",
    "image-preview", "image-zoom", "output-body", "reference", "theme-toggle"
  ]) {
    assert.ok(html.includes('id="' + id + '"'), "Missing " + id);
  }
  assert.match(html, /Python foundations/);
  assert.match(html, /Microscopy/);
  assert.match(html, /Sequence analysis/);
  assert.match(html, /Machine learning/);
  assert.match(html, /id="run-button"[^>]*disabled/);
  assert.ok(!html.includes('src="./src/main.js"'), "Legacy lesson UI should not load on this branch");
});
test("No false execution or populated lessons; the editor and image preview have real interactions", () => {
  const html = read("index.html");
  const js = read("src/ui-first.js");
  assert.match(html, /No lessons loaded yet/);
  assert.match(html, /Your lesson will appear here/);
  assert.match(html, /Python engine not connected/);
  assert.match(js, /localStorage\.setItem/);
  assert.match(js, /setRangeText/);
  assert.match(js, /URL\.createObjectURL/);
  assert.match(js, /URL\.revokeObjectURL/);
  assert.match(js, /naturalWidth/);
  assert.match(js, /pointermove/);
  assert.match(js, /aria-selected/);
  assert.ok(!js.includes("eval("), "Do not pretend to evaluate Python");
});
test("Responsive styles and original curriculum data remain available", () => {
  const css = read("styles.css");
  assert.match(css, /max-width:720px/);
  assert.match(css, /max-width:1050px/);
  assert.match(css, /prefers-reduced-motion/);
  assert.ok(fs.statSync(new URL("../src/course.js", import.meta.url)).size > 1000);
  assert.ok(fs.statSync(new URL("../curriculum/witz_exercise_inventory.json", import.meta.url)).size > 1000);
});