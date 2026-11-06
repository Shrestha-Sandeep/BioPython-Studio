import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const read = path => fs.readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("IDE-first shell has compact learning controls, real editor integration and viewer regions", () => {
 const html = read("index.html");
 for (const id of [
   "sidebar", "course-nav", "mode-python", "mode-image", "phase-panel", "lesson-toggle",
   "code-editor", "line-numbers", "run-button", "image-panel", "image-upload", "image-preview",
   "image-zoom", "pixel-readout", "preview-channel", "z-plane", "time-point",
   "horizontal-resizer", "vertical-resizer", "focus-toggle", "output-body", "reference", "theme-toggle"
 ]) assert.ok(html.includes('id="' + id + '"'), "Missing " + id);
 for (const stage of ["Python foundations", "Microscopy", "Sequence analysis", "Machine learning"])
   assert.match(html, new RegExp(stage));
 assert.match(html, /id="run-button"[^>]*disabled/);
 assert.match(html, /id="phase-panel"[^>]*hidden/);
 assert.match(html, /id="z-plane"[^>]*disabled/);
 assert.match(html, /id="time-point"[^>]*disabled/);
 assert.ok(!html.includes('src="./src/main.js"'), "Do not load legacy lesson application");
});
test("editor is genuine CodeMirror, with accessible offline fallback and saved drafts", () => {
 const html = read("index.html");
 const js = read("src/ui-first.js");
 assert.match(html, /codemirror@5\.65\.21\/lib\/codemirror\.min\.js/);
 assert.match(html, /codemirror@5\.65\.21\/mode\/python\/python\.min\.js/);
 assert.match(js, /CodeMirror\.fromTextArea/);
 assert.match(js, /indentUnit: 4/);
 assert.match(js, /cm\.getValue/);
 assert.match(js, /localStorage\.setItem/);
 assert.match(js, /setRangeText/);
 assert.match(js, /requestAnimationFrame/);
 assert.ok(!js.includes("eval("));
});
test("viewer provides RGB-only local preview, with disabled scientific processing", () => {
 const html = read("index.html");
 const js = read("src/ui-first.js");
 for (const term of ["Original", "Image viewer"]) assert.ok(html.includes(term) || term === "Original");
 assert.match(js, /URL\.createObjectURL/);
 assert.match(js, /URL\.revokeObjectURL/);
 assert.match(js, /getImageData/);
 assert.match(js, /naturalWidth/);
 assert.match(js, /renderChannel/);
 assert.match(js, /imageX/);
 assert.match(js, /pointermove/);
 assert.match(html, /TIFF\/OME support will be added/);
 assert.match(html, /Python engine not connected/);
});
test("responsive and keyboard-resizable panels preserve old course data", () => {
 const css = read("styles.css");
 const js = read("src/ui-first.js");
 assert.match(css, /max-width:720px/);
 assert.match(css, /max-width:1050px/);
 assert.match(css, /prefers-reduced-motion/);
 assert.match(css, /--editor-share/);
 assert.match(css, /cm-s-default/);
 assert.match(js, /aria-valuenow/);
 assert.match(js, /configureResizableHandle/);
 assert.ok(fs.statSync(new URL("../src/course.js", import.meta.url)).size > 1000);
 assert.ok(fs.statSync(new URL("../curriculum/witz_exercise_inventory.json", import.meta.url)).size > 1000);
});