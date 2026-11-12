import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const read = path => fs.readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("IDE-first shell has compact learning controls, real editor integration and viewer regions", () => {
 const html = read("index.html");
 for (const id of [
   "sidebar", "course-nav", "phase-panel", "lesson-toggle", "view-learn", "view-explore",
   "guided-nav", "guided-back", "guided-next", "guided-position", "mobile-workspace-tabs",
   "mobile-pane-code", "mobile-pane-image", "mobile-pane-result",
   "code-editor", "line-numbers", "run-button", "image-panel", "image-upload", "image-preview",
   "image-zoom", "pixel-readout", "preview-channel", "z-plane", "time-point",
   "horizontal-resizer", "vertical-resizer", "focus-toggle", "output-body", "reference", "theme-toggle",
   "compare-toggle", "comparison-tools", "comparison-upload", "comparison-mode", "comparison-opacity", "comparison-preview"
 ]) assert.ok(html.includes('id="' + id + '"'), "Missing " + id);
 for (const stage of ["Python foundations", "Microscopy", "Sequence analysis", "Machine learning"])
   assert.match(html, new RegExp(stage));
 assert.doesNotMatch(html, /id="mode-(?:python|image)"/, "Workspace switches automatically with the selected course");
 assert.doesNotMatch(html, /class="mode-switch"/, "No redundant header mode selector");
 assert.match(read("src/ui-first.js"), /switchMode\(info\.mode, true\)/, "Course stage must select code/image viewer automatically");
 assert.match(html, /id="run-button"[^>]*disabled/);
 assert.match(html, /id="phase-panel"[^>]*hidden/);
 assert.match(html, /id="z-plane"[^>]*disabled/);
 assert.match(html, /id="time-point"[^>]*disabled/);
 assert.ok(!html.includes('src="./src/main.js"'), "Do not load legacy lesson application");
});
test("editor is genuine CodeMirror, with accessible offline fallback and saved drafts", () => {
 const html = read("index.html");
 const js = read("src/ui-first.js");
 assert.match(html, /vendor\/codemirror5\/codemirror\.js/);
 assert.match(html, /vendor\/codemirror5\/python\.js/);
 assert.doesNotMatch(html, /https?:\/\/cdn\./);
 for (const asset of ["codemirror.js","codemirror.css","python.js","closebrackets.js","matchbrackets.js","LICENSE"])
   assert.ok(fs.statSync(new URL("../vendor/codemirror5/" + asset, import.meta.url)).size > 1000, "Missing locally bundled editor asset: " + asset);
 assert.match(read("vendor/codemirror5/LICENSE"), /MIT License/);
 assert.match(js, /CodeMirror\.fromTextArea/);
 assert.match(js, /indentUnit: 4/);
 assert.match(js, /cm\.getValue/);
 assert.match(js, /localStorage\.setItem/);
 assert.match(js, /setRangeText/);
 assert.match(js, /requestAnimationFrame/);
 assert.ok(!js.includes("eval("));
});
test("viewer retains an RGB-only preview while TIFF analysis uses the separate Python engine", () => {
 const html = read("index.html");
 const js = read("src/ui-first.js");
 for (const term of ["Original", "Image preview area"]) assert.ok(html.includes(term));
 assert.match(js, /URL\.createObjectURL/);
 assert.match(js, /URL\.revokeObjectURL/);
 assert.match(js, /getImageData/);
 assert.match(js, /naturalWidth/);
 assert.match(js, /renderChannel/);
 assert.match(js, /openComparison/);
 assert.match(js, /updateComparison/);
 assert.match(js, /originalImage\.width === comparisonImage\.width/);
 assert.match(html, /Comparison/);
 assert.match(js, /imageX/);
 assert.match(js, /pointermove/);
 assert.match(html, /TIFF files can be processed in Python/);
 assert.match(read("src/course-adapter.js"), /async function run\(\)/);
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
test("new UI defaults to Learn without branding, while Explore preserves the scientific engine", () => {
 const html = read("index.html");
 const css = read("src/ui-first-2.css");
 const js = read("src/ui-first-2.js");
 const adapter = read("src/course-adapter.js");
 assert.match(html, /<title>Learn Python<\/title>/);
 assert.match(html, /data-ui-view="learn"/);
 assert.match(html, /id="view-learn"[^>]*aria-pressed="true"/);
 assert.match(html, /id="view-explore"[^>]*aria-pressed="false"/);
 assert.doesNotMatch(html.slice(html.indexOf('<header'),html.indexOf('</header>')), /BioPython|Studio|Scientific Python|IDE/);
 assert.match(css, /data-ui-view=learn/);
 assert.match(css, /data-ui-view=explore/);
 assert.match(css, /data-mobile-pane=result/);
 assert.match(js, /bps:lesson-change/);
 assert.match(js, /localStorage\.setItem/);
 assert.match(js, /setMobilePane/);
 assert.match(js, /guided-next/);
 assert.match(adapter, /new CustomEvent\("bps:lesson-change"/);
 assert.match(adapter, /const GOAL_COUNTS=/);
 assert.match(adapter, /async function run\(\)/);
 assert.match(adapter, /async function check\(\)/);
 assert.ok(fs.statSync(new URL("../src/p01-worker.mjs", import.meta.url)).size > 1000);
});
