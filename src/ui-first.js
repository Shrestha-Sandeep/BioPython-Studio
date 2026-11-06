"use strict";
(() => {
  const $ = id => document.getElementById(id);
  const STORE = "biopython.ui-first.v1";
  const memory = { drafts: {}, theme: "dark", layout: {} };
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || "null");
    if (saved && typeof saved === "object" && !Array.isArray(saved)) {
      if (saved.drafts && typeof saved.drafts === "object" && !Array.isArray(saved.drafts)) memory.drafts = saved.drafts;
      if (saved.theme === "dark" || saved.theme === "light") memory.theme = saved.theme;
      if (saved.layout && typeof saved.layout === "object" && !Array.isArray(saved.layout)) memory.layout = saved.layout;
    }
  } catch { /* Browsers with blocked storage still retain working controls. */ }

  const STAGES = {
    Python: { title: "Python workspace", crumb: "Python foundations", subtitle: "A focused environment to learn and explore Python.", mode: "python" },
    Microscopy: { title: "Image analysis workspace", crumb: "Microscopy", subtitle: "Inspect images alongside your Python code and results.", mode: "image" },
    NGS: { title: "Sequence analysis workspace", crumb: "Sequence analysis", subtitle: "Work with biological sequence data using Python.", mode: "python" },
    ML: { title: "Machine learning workspace", crumb: "Machine learning", subtitle: "Explore models and results in a Python environment.", mode: "python" }
  };
  const PHASES = {
    learn: ["Your lesson will appear here", "A concise explanation and a single task will appear when lessons are added."],
    apply: ["Your practice task will appear here", "Applied exercises will use the same editor and output workspace."],
    prove: ["Your independent task will appear here", "An independent challenge will appear when the learning engine is connected."]
  };
  const RESULTS = {
    output: "Python output will appear here after execution is connected.",
    measurements: "Measurement tables will appear here after image analysis is connected.",
    histogram: "Image histograms and plots will appear here after analysis is connected."
  };
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  let stage = "Python";
  let mode = "python";
  let phase = "learn";
  let selectedResult = "output";
  let initialized = false;
  let suppressChange = false;
  let codeMirror = null;
  let imageURL = null;
  let pixelCanvas = null;
  let pixelContext = null;
  let imageScale = 1, imageX = 0, imageY = 0;
  let pan = null;
  let hasImage = false;

  function save() {
    try {
      localStorage.setItem(STORE, JSON.stringify(memory));
      $("save-status").textContent = "Saved locally";
    } catch {
      $("save-status").textContent = "Local saving unavailable";
    }
  }
  function draftKey() { return stage + ":" + mode; }
  function editorText() { return codeMirror ? codeMirror.getValue() : $("code-editor").value; }
  function setEditorText(value) {
    suppressChange = true;
    if (codeMirror) codeMirror.setValue(value);
    else $("code-editor").value = value;
    suppressChange = false;
    updateEditorPosition();
  }
  function persistEditor() {
    if (!initialized || suppressChange) return;
    memory.drafts[draftKey()] = editorText();
    save();
  }
  function restoreEditor() {
    const draft = memory.drafts[draftKey()];
    setEditorText(typeof draft === "string" ? draft : "");
    if (codeMirror) codeMirror.refresh();
  }
  function updateEditorPosition() {
    if (codeMirror) {
      const pos = codeMirror.getCursor();
      $("cursor").textContent = "Ln " + (pos.line + 1) + ", Col " + (pos.ch + 1);
      return;
    }
    const area = $("code-editor");
    const lines = area.value.split("\n");
    $("line-numbers").textContent = lines.map((_, i) => String(i + 1)).join("\n");
    const prefix = area.value.slice(0, area.selectionStart);
    const lineNumber = prefix.split("\n").length;
    $("cursor").textContent = "Ln " + lineNumber + ", Col " + (prefix.length - prefix.lastIndexOf("\n"));
  }
  function initializeEditor() {
    const area = $("code-editor");
    if (typeof window.CodeMirror !== "function") {
      $("editor-engine").textContent = "Python · Basic editor (offline-compatible)";
      updateEditorPosition();
      return;
    }
    try {
      codeMirror = window.CodeMirror.fromTextArea(area, {
        mode: "python",
        theme: "default",
        lineNumbers: true,
        lineWrapping: false,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
        matchBrackets: true,
        autoCloseBrackets: true,
        styleActiveLine: false,
        extraKeys: {
          Tab: editor => editor.replaceSelection("    ", "end"),
          "Shift-Tab": "indentLess",
          "Ctrl-S": () => save(),
          "Cmd-S": () => save()
        }
      });
      $("code-wrapper").classList.add("cm-ready");
      $("editor-engine").textContent = "Python · CodeMirror editor";
      codeMirror.on("change", () => { if (!suppressChange) persistEditor(); updateEditorPosition(); });
      codeMirror.on("cursorActivity", updateEditorPosition);
      codeMirror.setSize("100%", "100%");
    } catch (error) {
      if (codeMirror) { try { codeMirror.toTextArea(); } catch { /* preserve textarea */ } }
      codeMirror = null;
      $("code-wrapper").classList.remove("cm-ready");
      $("editor-engine").textContent = "Python · Basic editor (offline fallback)";
    }
    updateEditorPosition();
  }
  function switchMode(next, skipPersist = false) {
    if (next !== "python" && next !== "image") return;
    if (!skipPersist && next !== mode) persistEditor();
    mode = next;
    for (const button of document.querySelectorAll("[data-mode]")) button.setAttribute("aria-pressed", String(button.dataset.mode === mode));
    $("image-panel").hidden = mode !== "image";
    $("horizontal-resizer").hidden = mode !== "image";
    $("workspace-grid").classList.toggle("with-image", mode === "image");
    $("mode-label").textContent = mode === "image" ? "Code + scientific image" : "Python editor";
    restoreEditor();
    if (codeMirror) requestAnimationFrame(() => codeMirror.refresh());
  }
  function chooseStage(next) {
    if (!Object.prototype.hasOwnProperty.call(STAGES, next)) return;
    if (initialized) persistEditor();
    stage = next;
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
    switchMode(info.mode, true);
    initialized = true;
    $("sidebar").classList.remove("open");
    $("nav-toggle").setAttribute("aria-expanded", "false");
  }
  function choosePhase(next) {
    if (!Object.prototype.hasOwnProperty.call(PHASES, next)) return;
    phase = next;
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
  function lesson(open) {
    $("phase-panel").hidden = !open;
    $("lesson-toggle").setAttribute("aria-expanded", String(open));
    $("lesson-toggle").setAttribute("aria-label", open ? "Collapse lesson" : "Expand lesson");
  }
  function focus(enabled) {
    document.body.classList.toggle("focus-mode", enabled);
    $("focus-toggle").setAttribute("aria-pressed", String(enabled));
    $("focus-toggle").textContent = enabled ? "Exit focus" : "Focus";
    if (enabled) reference(false);
    if (codeMirror) requestAnimationFrame(() => codeMirror.refresh());
  }
  function chooseResult(next) {
    if (!Object.prototype.hasOwnProperty.call(RESULTS, next)) return;
    selectedResult = next;
    for (const tab of document.querySelectorAll("[data-result]")) {
      const active = tab.dataset.result === next;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    }
    $("output-body").setAttribute("aria-labelledby", "result-" + next);
    $("output-placeholder").textContent = RESULTS[next];
  }
  function reference(open) {
    $("reference").hidden = !open;
    $("app-layout").classList.toggle("reference-open", open);
    $("reference-toggle").setAttribute("aria-expanded", String(open));
    if (codeMirror) requestAnimationFrame(() => codeMirror.refresh());
  }
  function theme(next) {
    if (next !== "dark" && next !== "light") return;
    document.body.dataset.theme = next;
    $("theme-toggle").setAttribute("aria-label", next === "dark" ? "Switch to light theme" : "Switch to dark theme");
    memory.theme = next;
    save();
  }

  function applyShare(share) {
    const n = clamp(Math.round(share), 30, 75);
    document.documentElement.style.setProperty("--editor-share", n + "%");
    $("horizontal-resizer").setAttribute("aria-valuenow", String(n));
    memory.layout.share = n;
    save();
    if (codeMirror) codeMirror.refresh();
  }
  function applySize(work, consoleHeight) {
    const w = clamp(Math.round(work), 300, 900);
    const c = clamp(Math.round(consoleHeight), 100, 380);
    document.documentElement.style.setProperty("--work-height", w + "px");
    document.documentElement.style.setProperty("--console-height", c + "px");
    $("vertical-resizer").setAttribute("aria-valuenow", String(c));
    memory.layout.workHeight = w;
    memory.layout.consoleHeight = c;
    save();
    if (codeMirror) codeMirror.refresh();
  }
  function restoreLayout() {
    const layout = memory.layout;
    if (Number.isFinite(layout.share)) applyShare(layout.share);
    if (Number.isFinite(layout.workHeight) && Number.isFinite(layout.consoleHeight)) applySize(layout.workHeight, layout.consoleHeight);
  }
  function attachResizers() {
    const side = $("horizontal-resizer");
    side.addEventListener("pointerdown", event => {
      if (mode !== "image" || event.button !== 0) return;
      event.preventDefault();
      const bounds = $("workspace-grid").getBoundingClientRect();
      const compute = x => {
        const px = x - bounds.left;
        const minFraction = Math.max(30, 100 * 270 / bounds.width);
        const maxFraction = Math.min(75, 100 * (bounds.width - 270) / bounds.width);
        applyShare(clamp((px / bounds.width) * 100, minFraction, maxFraction));
      };
      side.setPointerCapture(event.pointerId);
      document.body.classList.add("is-resizing");
      compute(event.clientX);
      const move = e => compute(e.clientX);
      const end = () => {
        side.removeEventListener("pointermove", move);
        side.removeEventListener("pointerup", end);
        side.removeEventListener("pointercancel", end);
        document.body.classList.remove("is-resizing");
      };
      side.addEventListener("pointermove", move);
      side.addEventListener("pointerup", end);
      side.addEventListener("pointercancel", end);
    });
    side.addEventListener("keydown", event => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      applyShare((memory.layout.share || 54) + (event.key === "ArrowRight" ? 3 : -3));
    });
    const vertical = $("vertical-resizer");
    vertical.addEventListener("pointerdown", event => {
      if (event.button !== 0) return;
      event.preventDefault();
      const initialY = event.clientY;
      const work = $("code-wrapper").getBoundingClientRect().height;
      const consoleHeight = $("output-body").getBoundingClientRect().height;
      vertical.setPointerCapture(event.pointerId);
      document.body.classList.add("is-resizing-row");
      const move = e => {
        let delta = e.clientY - initialY;
        delta = clamp(delta, Math.max(300 - work, consoleHeight - 380), Math.min(900 - work, consoleHeight - 100));
        applySize(work + delta, consoleHeight - delta);
      };
      const end = () => {
        vertical.removeEventListener("pointermove", move);
        vertical.removeEventListener("pointerup", end);
        vertical.removeEventListener("pointercancel", end);
        document.body.classList.remove("is-resizing-row");
      };
      vertical.addEventListener("pointermove", move);
      vertical.addEventListener("pointerup", end);
      vertical.addEventListener("pointercancel", end);
    });
    vertical.addEventListener("keydown", event => {
      if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
      event.preventDefault();
      const work = $("code-wrapper").getBoundingClientRect().height;
      const consoleHeight = $("output-body").getBoundingClientRect().height;
      const delta = event.key === "ArrowUp" ? -24 : 24;
      applySize(work + delta, consoleHeight - delta);
    });
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
  function zoomImage(factor) {
    if (!hasImage) return;
    imageScale = clamp(+(imageScale * factor).toFixed(3), .25, 8);
    if (imageScale <= 1) { imageX = 0; imageY = 0; }
    transformImage();
  }
  function readPixel(event) {
    if (!hasImage) return;
    const image = $("image-preview");
    const box = image.getBoundingClientRect();
    const x = Math.floor((event.clientX - box.left) * image.naturalWidth / box.width);
    const y = Math.floor((event.clientY - box.top) * image.naturalHeight / box.height);
    if (x < 0 || y < 0 || x >= image.naturalWidth || y >= image.naturalHeight) {
      $("pixel-readout").textContent = "x — y —";
      return;
    }
    let reading = "x " + x + " y " + y;
    if (pixelContext) {
      try {
        const rgba = pixelContext.getImageData(x, y, 1, 1).data;
        reading += " · RGB " + rgba[0] + "," + rgba[1] + "," + rgba[2];
      } catch { /* Positional inspection remains useful if pixel access is unavailable. */ }
    }
    $("pixel-readout").textContent = reading;
  }
  function openImage(file) {
    if (!file) return;
    const accepted = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    if (!accepted.includes(file.type)) {
      $("image-meta").textContent = /tiff?/i.test(file.name) ? "TIFF/OME-TIFF decoding is not connected" : "Unsupported image format";
      return;
    }
    const candidate = URL.createObjectURL(file);
    const checker = new Image();
    $("image-loading").hidden = false;
    checker.onload = () => {
      $("image-loading").hidden = true;
      if (imageURL) URL.revokeObjectURL(imageURL);
      imageURL = candidate;
      const image = $("image-preview");
      image.src = candidate;
      image.hidden = false;
      $("image-empty").hidden = true;
      $("image-canvas").classList.add("loaded");
      hasImage = true;
      $("image-meta").textContent = file.name + " · " + checker.naturalWidth + " × " + checker.naturalHeight + " px";
      for (const id of ["zoom-in", "zoom-out", "zoom-reset"]) $(id).disabled = false;
      $("preview-channel").disabled = false;
      $("preview-channel").value = "rgb";
      image.style.filter = "";
      // Protect the browser from allocating enormous decoded canvases.
      pixelCanvas = pixelContext = null;
      if (checker.naturalWidth * checker.naturalHeight <= 12000000) {
        try {
          pixelCanvas = document.createElement("canvas");
          pixelCanvas.width = checker.naturalWidth;
          pixelCanvas.height = checker.naturalHeight;
          pixelContext = pixelCanvas.getContext("2d", { willReadFrequently: true });
          if (pixelContext) pixelContext.drawImage(checker, 0, 0);
        } catch { pixelCanvas = pixelContext = null; }
      }
      resetImageView();
    };
    checker.onerror = () => {
      URL.revokeObjectURL(candidate);
      $("image-loading").hidden = true;
      $("image-meta").textContent = "Could not open image";
    };
    checker.src = candidate;
  }
  function displayChannel(channel) {
    const filters = { rgb: "", red: "url(#preview-red)", green: "url(#preview-green)", blue: "url(#preview-blue)", gray: "grayscale(1)" };
    if (!Object.prototype.hasOwnProperty.call(filters, channel)) return;
    $("image-preview").style.filter = filters[channel];
  }

  $("code-editor").addEventListener("input", () => { if (!codeMirror) persistEditor(); updateEditorPosition(); });
  $("code-editor").addEventListener("click", updateEditorPosition);
  $("code-editor").addEventListener("keyup", updateEditorPosition);
  $("code-editor").addEventListener("scroll", e => { $("line-numbers").scrollTop = e.target.scrollTop; });
  $("code-editor").addEventListener("keydown", e => {
    if (codeMirror || e.key !== "Tab" || e.ctrlKey || e.metaKey || e.altKey) return;
    e.preventDefault();
    if (!e.shiftKey) {
      e.currentTarget.setRangeText("    ", e.currentTarget.selectionStart, e.currentTarget.selectionEnd, "end");
      persistEditor();
      updateEditorPosition();
    }
  });
  $("clear-code").addEventListener("click", () => {
    if (editorText() && !window.confirm("Clear the current editor draft?")) return;
    setEditorText("");
    persistEditor();
    if (codeMirror) codeMirror.focus();
    else $("code-editor").focus();
  });
  for (const link of document.querySelectorAll("[data-stage]")) link.addEventListener("click", () => chooseStage(link.dataset.stage));
  for (const button of document.querySelectorAll("[data-mode]")) button.addEventListener("click", () => switchMode(button.dataset.mode));
  for (const tab of document.querySelectorAll("[data-phase]")) {
    tab.addEventListener("click", () => { choosePhase(tab.dataset.phase); lesson(true); });
    tab.addEventListener("keydown", event => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const phases = ["learn", "apply", "prove"];
      const next = phases[(phases.indexOf(phase) + (event.key === "ArrowRight" ? 1 : 2)) % 3];
      choosePhase(next); lesson(true); $("tab-" + next).focus();
    });
  }
  for (const tab of document.querySelectorAll("[data-result]")) {
    tab.addEventListener("click", () => chooseResult(tab.dataset.result));
    tab.addEventListener("keydown", event => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const views = ["output", "measurements", "histogram"];
      const next = views[(views.indexOf(selectedResult) + (event.key === "ArrowRight" ? 1 : views.length - 1)) % views.length];
      chooseResult(next); $("result-" + next).focus();
    });
  }
  $("lesson-toggle").addEventListener("click", () => lesson($("phase-panel").hidden));
  $("focus-toggle").addEventListener("click", () => focus(!document.body.classList.contains("focus-mode")));
  $("reference-toggle").addEventListener("click", () => reference($("reference").hidden));
  $("reference-close").addEventListener("click", () => reference(false));
  $("theme-toggle").addEventListener("click", () => theme(document.body.dataset.theme === "dark" ? "light" : "dark"));
  $("nav-toggle").addEventListener("click", () => {
    const open = !$("sidebar").classList.contains("open");
    $("sidebar").classList.toggle("open", open);
    $("nav-toggle").setAttribute("aria-expanded", String(open));
  });
  $("image-upload").addEventListener("change", event => {
    openImage(event.target.files?.[0]);
    event.target.value = "";
  });
  document.querySelector(".load-button").addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      $("image-upload").click();
    }
  });
  $("zoom-out").addEventListener("click", () => zoomImage(1 / 1.25));
  $("zoom-in").addEventListener("click", () => zoomImage(1.25));
  $("zoom-reset").addEventListener("click", resetImageView);
  $("preview-channel").addEventListener("change", event => displayChannel(event.target.value));
  $("image-canvas").addEventListener("wheel", event => {
    if (!hasImage) return;
    event.preventDefault();
    zoomImage(event.deltaY < 0 ? 1.12 : 1 / 1.12);
  }, { passive: false });
  $("image-canvas").addEventListener("pointerdown", event => {
    if (!hasImage || imageScale <= 1 || event.button !== 0) return;
    pan = { x: event.clientX - imageX, y: event.clientY - imageY };
    $("image-canvas").classList.add("dragging");
    $("image-canvas").setPointerCapture(event.pointerId);
  });
  $("image-canvas").addEventListener("pointermove", event => {
    readPixel(event);
    if (!pan) return;
    imageX = event.clientX - pan.x;
    imageY = event.clientY - pan.y;
    transformImage();
  });
  $("image-canvas").addEventListener("pointerleave", () => { $("pixel-readout").textContent = "x — y —"; });
  const stopPan = () => { pan = null; $("image-canvas").classList.remove("dragging"); };
  $("image-canvas").addEventListener("pointerup", stopPan);
  $("image-canvas").addEventListener("pointercancel", stopPan);
  window.addEventListener("beforeunload", () => { if (imageURL) URL.revokeObjectURL(imageURL); });
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    reference(false);
    $("sidebar").classList.remove("open");
    $("nav-toggle").setAttribute("aria-expanded", "false");
    if (document.body.classList.contains("focus-mode")) focus(false);
  });

  initializeEditor();
  theme(memory.theme);
  restoreLayout();
  attachResizers();
  chooseStage("Python");
  choosePhase("learn");
  chooseResult("output");
  lesson(false);
  $("run-button").disabled = true;
})();
