// UI-first learning shell. No curriculum is loaded, no Python is executed, and no analysis is simulated.
const byId = id => document.getElementById(id);
const STAGES = ["Python", "Microscopy", "NGS", "ML"];
const PHASES = ["learn", "apply", "prove"];
const RESULTS = ["output", "measurements"];
const STATE_KEY = "biopython.ui-shell.settings.v1";
const DRAFT_KEY = "biopython.ui-shell.drafts.v1";

function readJSON(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value && typeof value === "object" && !Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}
const stored = readJSON(STATE_KEY, {});
const drafts = readJSON(DRAFT_KEY, {});
const route = new URLSearchParams(location.search).get("workspace");
const routeStage = STAGES.find(stage => stage.toLowerCase() === route);
const state = {
  stage: routeStage || (STAGES.includes(stored.stage) ? stored.stage : "Python"),
  phase: PHASES.includes(stored.phase) ? stored.phase : "learn",
  result: "output",
  reference: false,
  theme: stored.theme === "light" ? "light" : "dark"
};
const shell = document.querySelector(".app-shell");
const editor = byId("code-editor");
const numbers = byId("line-numbers");
let draftSaveAvailable = true;
let previewURL = null;
let imageLoaded = false;
let zoom = 1;
let panX = 0;
let panY = 0;
let pointer = null;

function persistSettings() {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify({
      stage: state.stage, phase: state.phase, theme: state.theme
    }));
  } catch {
    // Private browsing can disable storage. The workspace remains usable.
  }
}
function persistDraft() {
  drafts[state.stage] = editor.value;
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
    draftSaveAvailable = true;
  } catch {
    draftSaveAvailable = false;
  }
  byId("save-state").textContent = draftSaveAvailable ? "Saved locally" : "Local saving unavailable";
}
function updatePosition() {
  const beforeCursor = editor.value.slice(0, editor.selectionStart);
  const line = beforeCursor.split("\n").length;
  const lastBreak = beforeCursor.lastIndexOf("\n");
  const column = beforeCursor.length - lastBreak;
  byId("editor-position").textContent = "Ln " + line + ", Col " + column;
}
function updateLineNumbers() {
  const lineCount = Math.min(5000, editor.value.split("\n").length);
  numbers.textContent = Array.from({length: lineCount}, (_, index) => String(index + 1)).join("\n");
  numbers.scrollTop = editor.scrollTop;
  updatePosition();
}
function setTheme(theme) {
  state.theme = theme;
  document.body.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#0c1118" : "#f5f7f8";
  byId("theme-toggle").setAttribute("aria-label", "Switch to " + (theme === "dark" ? "light" : "dark") + " theme");
  persistSettings();
}
function setReference(open) {
  state.reference = open;
  shell.classList.toggle("reference-open", open);
  byId("reference-panel").hidden = !open;
  byId("reference-toggle").setAttribute("aria-expanded", String(open));
}
function closeMobileMenu() {
  byId("course-sidebar").classList.remove("open");
  byId("menu-toggle").setAttribute("aria-expanded", "false");
  byId("menu-toggle").setAttribute("aria-label", "Open course navigation");
}
function setPhase(phase, focus = false) {
  if (!PHASES.includes(phase)) return;
  state.phase = phase;
  document.querySelectorAll(".step-tabs [role=tab]").forEach(button => {
    const selected = button.dataset.phase === phase;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  byId("phase-panel").setAttribute("aria-labelledby", "phase-" + phase);
  const details = {
    learn: ["Learn", "Your lesson will appear here", "A concise explanation and one clear task will appear here. No lesson content is loaded yet."],
    apply: ["Apply", "Your practice task will appear here", "Guided exercises will be added here after the interface is finalized."],
    prove: ["Prove", "Your independent challenge will appear here", "An independent task and feedback will appear here when the learning engine is connected."]
  };
  byId("phase-label").textContent = details[phase][0];
  byId("phase-title").textContent = details[phase][1];
  byId("phase-description").textContent = details[phase][2];
  persistSettings();
  if (focus) byId("phase-" + phase).focus();
}
function setResult(result, focus = false) {
  if (!RESULTS.includes(result)) return;
  if (result === "measurements" && state.stage !== "Microscopy") return;
  state.result = result;
  document.querySelectorAll(".result-tabs [role=tab]").forEach(button => {
    const selected = button.dataset.result === result;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  byId("result-panel").setAttribute("aria-labelledby", "result-" + result);
  byId("result-placeholder").textContent = result === "output"
    ? "Python output will appear here when execution is connected."
    : "Image measurements and tables will appear here after real analysis is enabled.";
  if (focus) byId("result-" + result).focus();
}
function selectStage(stage) {
  if (!STAGES.includes(stage)) return;
  if (stage !== state.stage) persistDraft();
  state.stage = stage;
  const microscopy = stage === "Microscopy";
  const titles = {
    Python: ["Python workspace", "A focused space for understanding, writing and testing code."],
    Microscopy: ["Image analysis workspace", "Write Python alongside your microscopy images and inspect real outputs."],
    NGS: ["NGS workspace", "A focused coding space for future sequence-analysis lessons."],
    ML: ["Machine learning workspace", "A focused coding space for future modelling lessons."]
  };
  byId("breadcrumb-stage").textContent = stage;
  byId("workspace-title").textContent = titles[stage][0];
  byId("workspace-subtitle").textContent = titles[stage][1];
  byId("work-mode-label").textContent = microscopy ? "Python + image viewer" : "Python";
  document.querySelectorAll(".stage-link").forEach(button => {
    if (button.dataset.stage === stage) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  byId("image-panel").hidden = !microscopy;
  byId("work-grid").classList.toggle("with-image", microscopy);
  byId("result-measurements").hidden = !microscopy;
  byId("lesson-list-placeholder").textContent = "No lessons loaded yet.";
  editor.value = typeof drafts[stage] === "string" ? drafts[stage] : "";
  byId("save-state").textContent = draftSaveAvailable ? "Saved locally" : "Local saving unavailable";
  updateLineNumbers();
  if (!microscopy) setResult("output");
  else setResult(state.result);
  setPhase(state.phase);
  persistSettings();
  if (location.protocol === "http:" || location.protocol === "https:") {
    const url = new URL(location.href);
    url.searchParams.set("workspace", stage.toLowerCase());
    history.replaceState(null, "", url);
  }
  closeMobileMenu();
}
function toast(message) {
  const node = byId("toast");
  node.textContent = message;
  node.hidden = false;
  // An explicit close action is not needed: new interactions dismiss it.
}
function dismissToast() { byId("toast").hidden = true; }

function syncImageTransform() {
  byId("preview-image").style.transform =
    "translate(" + panX + "px," + panY + "px) scale(" + zoom + ")";
  byId("zoom-value").textContent = Math.round(zoom * 100) + "%";
}
function changeZoom(multiplier) {
  if (!imageLoaded) return;
  zoom = Math.max(1, Math.min(8, Math.round(zoom * multiplier * 100) / 100));
  if (zoom === 1) { panX = 0; panY = 0; }
  syncImageTransform();
}
function fitImage() {
  if (!imageLoaded) return;
  zoom = 1; panX = 0; panY = 0;
  syncImageTransform();
}
function previewFile(file) {
  if (!file) return;
  const accepted = ["image/png", "image/jpeg", "image/webp", "image/gif"];
  if (!accepted.includes(file.type)) {
    toast("Only PNG, JPEG, WebP or GIF previews are supported. Scientific TIFF loading comes later.");
    return;
  }
  if (file.size > 25 * 1024 * 1024) {
    toast("This UI preview accepts image files up to 25 MB.");
    return;
  }
  dismissToast();
  const nextURL = URL.createObjectURL(file);
  const img = byId("preview-image");
  img.onload = () => {
    if (previewURL) URL.revokeObjectURL(previewURL);
    previewURL = nextURL;
    imageLoaded = true;
    img.hidden = false;
    byId("image-empty").hidden = true;
    byId("image-viewport").classList.add("has-image");
    for (const id of ["zoom-out", "zoom-fit", "zoom-in"]) byId(id).disabled = false;
    byId("image-info").textContent = file.name + " · " + img.naturalWidth + " × " + img.naturalHeight + " px";
    fitImage();
  };
  img.onerror = () => {
    URL.revokeObjectURL(nextURL);
    toast("The browser could not display that image.");
  };
  img.src = nextURL;
}
document.querySelectorAll(".stage-link").forEach(button => {
  button.addEventListener("click", () => { dismissToast(); selectStage(button.dataset.stage); });
});
document.querySelectorAll(".step-tabs [role=tab]").forEach(button => {
  button.addEventListener("click", () => setPhase(button.dataset.phase));
  button.addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const offset = event.key === "ArrowRight" ? 1 : PHASES.length - 1;
    const next = PHASES[(PHASES.indexOf(state.phase) + offset) % PHASES.length];
    setPhase(next, true);
  });
});
document.querySelectorAll(".result-tabs [role=tab]").forEach(button => {
  button.addEventListener("click", () => setResult(button.dataset.result));
  button.addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const available = state.stage === "Microscopy" ? RESULTS : ["output"];
    const next = available[(available.indexOf(state.result) + (event.key === "ArrowRight" ? 1 : available.length - 1)) % available.length];
    setResult(next, true);
  });
});
byId("reference-toggle").addEventListener("click", () => setReference(!state.reference));
byId("reference-close").addEventListener("click", () => { setReference(false); byId("reference-toggle").focus(); });
byId("theme-toggle").addEventListener("click", () => setTheme(state.theme === "dark" ? "light" : "dark"));
byId("menu-toggle").addEventListener("click", () => {
  const open = byId("course-sidebar").classList.toggle("open");
  byId("menu-toggle").setAttribute("aria-expanded", String(open));
  byId("menu-toggle").setAttribute("aria-label", open ? "Close course navigation" : "Open course navigation");
});
editor.addEventListener("input", () => { updateLineNumbers(); persistDraft(); dismissToast(); });
editor.addEventListener("scroll", () => { numbers.scrollTop = editor.scrollTop; });
editor.addEventListener("click", updatePosition);
editor.addEventListener("keyup", updatePosition);
editor.addEventListener("keydown", event => {
  if (event.key !== "Tab") return;
  event.preventDefault();
  editor.setRangeText("    ", editor.selectionStart, editor.selectionEnd, "end");
  editor.dispatchEvent(new Event("input", {bubbles: true}));
});
byId("reset-editor").addEventListener("click", () => {
  if (!editor.value) return;
  if (window.confirm("Clear this local Python draft?")) {
    editor.value = "";
    persistDraft();
    updateLineNumbers();
    editor.focus();
  }
});
byId("image-upload").addEventListener("change", event => previewFile(event.target.files?.[0]));
document.querySelector(".upload-button").addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault(); byId("image-upload").click();
  }
});
byId("zoom-in").addEventListener("click", () => changeZoom(1.25));
byId("zoom-out").addEventListener("click", () => changeZoom(.8));
byId("zoom-fit").addEventListener("click", fitImage);
const viewport = byId("image-viewport");
viewport.addEventListener("wheel", event => {
  if (!imageLoaded) return;
  event.preventDefault();
  changeZoom(event.deltaY < 0 ? 1.1 : 1 / 1.1);
}, {passive: false});
viewport.addEventListener("pointerdown", event => {
  if (!imageLoaded || zoom <= 1) return;
  pointer = {id:event.pointerId, x:event.clientX, y:event.clientY, px:panX, py:panY};
  viewport.classList.add("dragging");
  viewport.setPointerCapture(event.pointerId);
});
viewport.addEventListener("pointermove", event => {
  if (!pointer || pointer.id !== event.pointerId) return;
  panX = pointer.px + event.clientX - pointer.x;
  panY = pointer.py + event.clientY - pointer.y;
  syncImageTransform();
});
function endPan() { pointer = null; viewport.classList.remove("dragging"); }
viewport.addEventListener("pointerup", endPan);
viewport.addEventListener("pointercancel", endPan);
viewport.addEventListener("dragover", event => { event.preventDefault(); viewport.classList.add("dragging"); });
viewport.addEventListener("dragleave", () => viewport.classList.remove("dragging"));
viewport.addEventListener("drop", event => {
  event.preventDefault();
  viewport.classList.remove("dragging");
  previewFile(event.dataTransfer?.files?.[0]);
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    setReference(false);
    closeMobileMenu();
    dismissToast();
  }
});
document.addEventListener("click", event => {
  const sidebar = byId("course-sidebar");
  if (sidebar.classList.contains("open") && !sidebar.contains(event.target) && !byId("menu-toggle").contains(event.target)) closeMobileMenu();
});
window.addEventListener("beforeunload", () => {
  if (previewURL) URL.revokeObjectURL(previewURL);
});

setTheme(state.theme);
setReference(false);
setPhase(state.phase);
selectStage(state.stage);
