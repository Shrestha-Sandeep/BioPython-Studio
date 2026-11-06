"use strict";
(() => {
  const $ = (id) => document.getElementById(id);
  const STORE = "biopython.ui-first.v1";
  const memory = { drafts: {}, theme: "dark" };
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || "null");
    if (saved && typeof saved === "object" && !Array.isArray(saved)) {
      if (saved.drafts && typeof saved.drafts === "object" && !Array.isArray(saved.drafts)) {
        memory.drafts = saved.drafts;
      }
      if (saved.theme === "dark" || saved.theme === "light") memory.theme = saved.theme;
    }
  } catch { /* Browsers without storage still get a working editor. */ }

  const STAGES = {
    Python: { title: "Python workspace", crumb: "Python foundations", subtitle: "Learn, write and investigate Python in one focused space.", mode: "python" },
    Microscopy: { title: "Image analysis workspace", crumb: "Microscopy", subtitle: "Inspect images alongside your Python code and results.", mode: "image" },
    NGS: { title: "Sequence analysis workspace", crumb: "Sequence analysis", subtitle: "Work with biological sequence data using Python.", mode: "python" },
    ML: { title: "Machine learning workspace", crumb: "Machine learning", subtitle: "Explore models and results in a practical Python environment.", mode: "python" }
  };
  const PHASES = {
    learn: ["Your lesson will appear here", "A concise explanation and one clear task will appear when lessons are added."],
    apply: ["Your practice task will appear here", "The applied exercise will use the same editor and output workspace."],
    prove: ["Your independent task will appear here", "An independent challenge will appear when the learning engine is connected."]
  };

  let stage = "Python";
  let mode = "python";
  let phase = "learn";
  let result = "output";
  let imageURL = null;
  let imageScale = 1;
  let imageX = 0;
  let imageY = 0;
  let drag = null;
  let hasImage = false;

  function save() {
    try {
      localStorage.setItem(STORE, JSON.stringify(memory));
      $("save-status").textContent = "Saved locally";
    } catch {
      $("save-status").textContent = "Local saving unavailable";
    }
  }
  function key() { return stage + ":" + mode; }
  function saveEditor() {
    memory.drafts[key()] = $("code-editor").value;
    save();
  }
  function restoreEditor() {
    $("code-editor").value = typeof memory.drafts[key()] === "string" ? memory.drafts[key()] : "";
    updateEditor();
  }
  function updateEditor() {
    const editor = $("code-editor");
    const count = editor.value.split("\n").length;
    $("line-numbers").textContent = Array.from({ length: count }, (_, i) => String(i + 1)).join("\n");
    const at = editor.selectionStart;
    const before = editor.value.slice(0, at);
    const line = before.split("\n").length;
    const col = before.length - before.lastIndexOf("\n");
    $("cursor").textContent = "Ln " + line + ", Col " + col;
  }
  function switchMode(nextMode) {
    if (nextMode !== "python" && nextMode !== "image") return;
    if (nextMode !== mode) saveEditor();
    mode = nextMode;
    for (const button of document.querySelectorAll("[data-mode]")) {
      button.setAttribute("aria-pressed", String(button.dataset.mode === mode));
    }
    $("image-panel").hidden = mode !== "image";
    $("workspace-grid").classList.toggle("with-image", mode === "image");
    $("mode-label").textContent = mode === "image" ? "Code + image viewer" : "Python editor";
    restoreEditor();
  }
  function chooseStage(nextStage) {
    if (!Object.prototype.hasOwnProperty.call(STAGES, nextStage)) return;
    saveEditor();
    stage = nextStage;
    const info = STAGES[stage];
    $("page-title").textContent = info.title;
    $("page-subtitle").textContent = info.subtitle;
    $("crumb").textContent = info.crumb;
    for (const link of document.querySelectorAll("[data-stage]")) {
      const active = link.dataset.stage === stage;
      link.classList.toggle("selected", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
    switchMode(info.mode);
    $("sidebar").classList.remove("open");
    $("nav-toggle").setAttribute("aria-expanded", "false");
  }
  function choosePhase(nextPhase) {
    if (!Object.prototype.hasOwnProperty.call(PHASES, nextPhase)) return;
    phase = nextPhase;
    for (const tab of document.querySelectorAll("[data-phase]")) {
      const active = tab.dataset.phase === phase;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    }
    $("phase-panel").setAttribute("aria-labelledby", "tab-" + phase);
    $("phase-caption").textContent = phase.toUpperCase();
    $("phase-title").textContent = PHASES[phase][0];
    $("phase-description").textContent = PHASES[phase][1];
  }
  function chooseResult(nextResult) {
    if (nextResult !== "output" && nextResult !== "measurements") return;
    result = nextResult;
    for (const tab of document.querySelectorAll("[data-result]")) {
      const active = tab.dataset.result === result;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    }
    $("output-body").setAttribute("aria-labelledby", "result-" + result);
    $("output-placeholder").textContent =
      result === "output"
        ? "Python output will appear here after the execution engine is added."
        : "Measurement tables and plots will appear here after the analysis engine is added.";
  }
  function reference(open) {
    $("reference").hidden = !open;
    $("app-layout").classList.toggle("reference-open", open);
    $("reference-toggle").setAttribute("aria-expanded", String(open));
  }
  function theme(next) {
    if (next !== "dark" && next !== "light") return;
    document.body.dataset.theme = next;
    $("theme-toggle").setAttribute("aria-label", next === "dark" ? "Switch to light theme" : "Switch to dark theme");
    memory.theme = next;
    save();
  }
  function resetImageView() {
    imageScale = 1;
    imageX = 0;
    imageY = 0;
    transformImage();
  }
  function transformImage() {
    $("image-preview").style.transform = "translate(" + imageX + "px," + imageY + "px) scale(" + imageScale + ")";
    $("image-zoom").textContent = hasImage ? Math.round(imageScale * 100) + "%" : "—";
  }
  function scaleImage(direction) {
    if (!hasImage) return;
    imageScale = Math.max(.25, Math.min(8, +(imageScale * direction).toFixed(3)));
    if (imageScale <= 1) { imageX = 0; imageY = 0; }
    transformImage();
  }
  function openImage(file) {
    if (!file) return;
    const supported = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    if (!supported.includes(file.type)) {
      $("image-meta").textContent = "Unsupported image preview format";
      return;
    }
    const candidate = URL.createObjectURL(file);
    const image = $("image-preview");
    const checker = new Image();
    checker.onload = () => {
      if (imageURL) URL.revokeObjectURL(imageURL);
      imageURL = candidate;
      image.src = candidate;
      image.hidden = false;
      $("image-empty").hidden = true;
      $("image-canvas").classList.add("loaded");
      hasImage = true;
      $("image-meta").textContent = file.name + " · " + checker.naturalWidth + " × " + checker.naturalHeight + " px";
      for (const id of ["zoom-in", "zoom-out", "zoom-reset"]) $(id).disabled = false;
      resetImageView();
    };
    checker.onerror = () => {
      URL.revokeObjectURL(candidate);
      $("image-meta").textContent = "Could not open image";
    };
    checker.src = candidate;
  }

  $("code-editor").addEventListener("input", () => { saveEditor(); updateEditor(); });
  $("code-editor").addEventListener("click", updateEditor);
  $("code-editor").addEventListener("keyup", updateEditor);
  $("code-editor").addEventListener("scroll", (event) => { $("line-numbers").scrollTop = event.target.scrollTop; });
  $("code-editor").addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || event.ctrlKey || event.metaKey || event.altKey) return;
    event.preventDefault();
    if (!event.shiftKey) {
      const editor = event.currentTarget;
      editor.setRangeText("    ", editor.selectionStart, editor.selectionEnd, "end");
      saveEditor(); updateEditor();
    }
  });
  $("clear-code").addEventListener("click", () => {
    if ($("code-editor").value && !window.confirm("Clear the current editor draft?")) return;
    $("code-editor").value = "";
    saveEditor();
    updateEditor();
    $("code-editor").focus();
  });
  for (const link of document.querySelectorAll("[data-stage]")) link.addEventListener("click", () => chooseStage(link.dataset.stage));
  for (const button of document.querySelectorAll("[data-mode]")) button.addEventListener("click", () => switchMode(button.dataset.mode));
  for (const tab of document.querySelectorAll("[data-phase]")) {
    tab.addEventListener("click", () => choosePhase(tab.dataset.phase));
    tab.addEventListener("keydown", event => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const order = ["learn", "apply", "prove"];
      const current = order.indexOf(phase);
      const next = order[(current + (event.key === "ArrowRight" ? 1 : 2)) % 3];
      choosePhase(next);
      $("tab-" + next).focus();
    });
  }
  for (const tab of document.querySelectorAll("[data-result]")) {
    tab.addEventListener("click", () => chooseResult(tab.dataset.result));
    tab.addEventListener("keydown", event => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      chooseResult(result === "output" ? "measurements" : "output");
      $("result-" + result).focus();
    });
  }
  $("reference-toggle").addEventListener("click", () => reference($("reference").hidden));
  $("reference-close").addEventListener("click", () => reference(false));
  $("theme-toggle").addEventListener("click", () => theme(document.body.dataset.theme === "dark" ? "light" : "dark"));
  $("nav-toggle").addEventListener("click", () => {
    const open = !$("sidebar").classList.contains("open");
    $("sidebar").classList.toggle("open", open);
    $("nav-toggle").setAttribute("aria-expanded", String(open));
  });
  $("image-upload").addEventListener("change", e => { openImage(e.target.files?.[0]); e.target.value = ""; });
  document.querySelector(".load-button").addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); $("image-upload").click(); }
  });
  $("zoom-out").addEventListener("click", () => scaleImage(1 / 1.25));
  $("zoom-in").addEventListener("click", () => scaleImage(1.25));
  $("zoom-reset").addEventListener("click", resetImageView);
  $("image-canvas").addEventListener("wheel", event => {
    if (!hasImage) return;
    event.preventDefault();
    scaleImage(event.deltaY < 0 ? 1.12 : 1 / 1.12);
  }, { passive: false });
  $("image-canvas").addEventListener("pointerdown", event => {
    if (!hasImage || imageScale <= 1 || event.button !== 0) return;
    drag = { x: event.clientX - imageX, y: event.clientY - imageY };
    $("image-canvas").classList.add("dragging");
    $("image-canvas").setPointerCapture(event.pointerId);
  });
  $("image-canvas").addEventListener("pointermove", event => {
    if (!drag) return;
    imageX = event.clientX - drag.x; imageY = event.clientY - drag.y;
    transformImage();
  });
  const stopDrag = () => { drag = null; $("image-canvas").classList.remove("dragging"); };
  $("image-canvas").addEventListener("pointerup", stopDrag);
  $("image-canvas").addEventListener("pointercancel", stopDrag);
  window.addEventListener("beforeunload", () => { if (imageURL) URL.revokeObjectURL(imageURL); });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      reference(false);
      $("sidebar").classList.remove("open");
      $("nav-toggle").setAttribute("aria-expanded", "false");
    }
  });
  theme(memory.theme);
  chooseStage("Python");
  choosePhase("learn");
  chooseResult("output");
  $("run-button").disabled = true;
})();
