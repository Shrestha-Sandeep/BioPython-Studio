"use strict";
(() => {
  const $ = (id) => document.getElementById(id);
  const STORE = "biopython.ui-first.v1";
  const memory = { drafts: {}, theme: "dark", layout: { editorShare: 54, consoleHeight: 160, lessonOpen: false } };
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || "null");
    if (saved && typeof saved === "object" && !Array.isArray(saved)) {
      if (saved.drafts && typeof saved.drafts === "object" && !Array.isArray(saved.drafts)) {
        memory.drafts = saved.drafts;
      }
      if (["dark", "light"].includes(saved.theme)) memory.theme = saved.theme;
      if (saved.layout && typeof saved.layout === "object") {
        if (Number.isFinite(saved.layout.editorShare)) memory.layout.editorShare = Math.min(75, Math.max(30, saved.layout.editorShare));
        if (Number.isFinite(saved.layout.consoleHeight)) memory.layout.consoleHeight = Math.min(380, Math.max(100, saved.layout.consoleHeight));
        if (typeof saved.layout.lessonOpen === "boolean") memory.layout.lessonOpen = saved.layout.lessonOpen;
      }
    }
  } catch { /* The workspace still works when storage is blocked. */ }

  const STAGES = {
    Python: { title: "Python workspace", crumb: "Python foundations", subtitle: "A focused environment to learn and explore Python.", mode: "python" },
    Microscopy: { title: "Image analysis workspace", crumb: "Microscopy", subtitle: "Write code and inspect microscopy image previews side by side.", mode: "image" },
    NGS: { title: "Sequence analysis workspace", crumb: "Sequence analysis", subtitle: "A workspace for biological sequence analysis in Python.", mode: "python" },
    ML: { title: "Machine learning workspace", crumb: "Machine learning", subtitle: "A workspace for models, data and scientific predictions.", mode: "python" }
  };
  const PHASES = {
    learn: ["Your lesson will appear here", "A concise explanation and one clear task will appear when lessons are added."],
    apply: ["Your practice task will appear here", "Practice will use the same editor, viewer and results workspace."],
    prove: ["Your independent task will appear here", "Independent challenges will appear once lesson content is connected."]
  };
  const RESULTS = {
    output: "Python output will appear here after execution is connected.",
    measurements: "Scientific measurements will appear here when image and data processing are connected.",
    histogram: "Histograms will appear here when image-analysis processing is connected."
  };
  let stage = "Python", mode = "python", phase = "learn", result = "output";
  let initialized = false, restoring = false, focusMode = false;
  let cm = null, hasImage = false, imageURL = null, imageScale = 1, imageX = 0, imageY = 0, drag = null;
  let originalImage = null, pixelData = null, pixelWidth = 0, pixelHeight = 0;
  let comparisonURL = null, comparisonImage = null, compareEnabled = false;
  let dividerDrag = null;

  function save() {
    try {
      localStorage.setItem(STORE, JSON.stringify(memory));
      $("save-status").textContent = "Saved locally";
    } catch {
      $("save-status").textContent = "Local saving unavailable";
    }
  }
  function draftKey() { return stage + ":" + mode; }
  function getCode() { return cm ? cm.getValue() : $("code-editor").value; }
  function setCode(value) {
    restoring = true;
    if (cm) cm.setValue(value); else $("code-editor").value = value;
    restoring = false;
    updateCursor();
  }
  function saveEditor() {
    if (restoring) return;
    if (window.BioPythonP01?.ownsEditor?.()) {
      window.BioPythonP01.onEditorChange?.(getCode());
      return;
    }
    memory.drafts[draftKey()] = getCode();
    save();
  }
  function restoreEditor() {
    const value = memory.drafts[draftKey()];
    setCode(typeof value === "string" ? value : "");
  }
  function updateCursor() {
    if (cm) {
      const at = cm.getCursor();
      $("cursor").textContent = "Ln " + (at.line + 1) + ", Col " + (at.ch + 1);
      return;
    }
    const editor = $("code-editor");
    const lines = editor.value.split("\n").length;
    $("line-numbers").textContent = Array.from({length:lines}, (_, i) => String(i + 1)).join("\n");
    const before = editor.value.slice(0, editor.selectionStart);
    const ln = before.split("\n").length;
    $("cursor").textContent = "Ln " + ln + ", Col " + (before.length - before.lastIndexOf("\n"));
  }
  function startEditor() {
    if (window.CodeMirror && typeof window.CodeMirror.fromTextArea === "function") {
      cm = window.CodeMirror.fromTextArea($("code-editor"), {
        mode: "python", lineNumbers: true, lineWrapping: window.innerWidth <= 900,
        indentUnit: 4, tabSize: 4, indentWithTabs: false,
        matchBrackets: true, autoCloseBrackets: true, viewportMargin: 10,
        extraKeys: {
          Tab: editor => editor.somethingSelected() ? editor.indentSelection("add") : editor.replaceSelection("    ", "end"),
          "Shift-Tab": "indentLess"
        }
      });
      $("code-wrapper").classList.add("cm-ready");
      cm.on("change", saveEditor);
      cm.on("cursorActivity", updateCursor);
      $("editor-engine").textContent = "Python · CodeMirror editor";
    } else {
      $("editor-engine").textContent = "Python · Basic editor (offline fallback)";
      const native = $("code-editor");
      native.addEventListener("input", () => { saveEditor(); updateCursor(); });
      native.addEventListener("click", updateCursor);
      native.addEventListener("keyup", updateCursor);
      native.addEventListener("scroll", event => { $("line-numbers").scrollTop = event.target.scrollTop; });
      native.addEventListener("keydown", event => {
        if (event.key !== "Tab" || event.ctrlKey || event.metaKey || event.altKey) return;
        event.preventDefault();
        if (!event.shiftKey) {
          native.setRangeText("    ", native.selectionStart, native.selectionEnd, "end");
          saveEditor(); updateCursor();
        }
      });
    }
  }

  function switchMode(next, skipSave = false) {
    if (!["python", "image"].includes(next)) return;
    if (!skipSave && next !== mode) saveEditor();
    mode = next;
    for (const button of document.querySelectorAll("[data-mode]")) {
      button.setAttribute("aria-pressed", String(button.dataset.mode === mode));
    }
    const showImage = mode === "image";
    $("image-panel").hidden = !showImage;
    $("horizontal-resizer").hidden = !showImage;
    $("workspace-grid").classList.toggle("with-image", showImage);
    $("mode-label").textContent = showImage ? "Code + image viewer" : "Python editor";
    $("page-title").textContent = showImage ? "Image analysis workspace" : STAGES[stage].title;
    $("page-subtitle").textContent = showImage ? "Inspect your images alongside code and results." : STAGES[stage].subtitle;
    restoreEditor();
    requestAnimationFrame(fitImageDisplays);
    if (cm) requestAnimationFrame(() => cm.refresh());
  }
  function chooseStage(next) {
    if (!Object.prototype.hasOwnProperty.call(STAGES, next)) return;
    if (initialized) saveEditor();
    stage = next;
    const info = STAGES[stage];
    $("page-title").textContent = info.title;
    $("page-subtitle").textContent = info.subtitle;
    $("crumb").textContent = info.crumb;
    for (const item of document.querySelectorAll("[data-stage]")) {
      const selected = item.dataset.stage === stage;
      item.classList.toggle("selected", selected);
      if (selected) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    }
    switchMode(info.mode, true);
    initialized = true;
    $("sidebar").classList.remove("open");
    $("nav-toggle").setAttribute("aria-expanded", "false");
  }
  function choosePhase(next) {
    if (!Object.prototype.hasOwnProperty.call(PHASES, next)) return;
    phase = next;
    $("phase-caption").textContent = next.toUpperCase();
    $("phase-title").textContent = PHASES[next][0];
    $("phase-description").textContent = PHASES[next][1];
    for (const item of document.querySelectorAll("[data-phase]")) {
      const active = item.dataset.phase === next;
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
    }
    $("phase-panel").setAttribute("aria-labelledby", "tab-" + next);
  }
  function chooseResult(next) {
    if (!Object.prototype.hasOwnProperty.call(RESULTS, next)) return;
    result = next;
    for (const item of document.querySelectorAll("[data-result]")) {
      const active = item.dataset.result === next;
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
    }
    $("output-body").setAttribute("aria-labelledby", "result-" + next);
    $("output-placeholder").textContent = RESULTS[next];
  }
  function openLesson(show, remember = true) {
    $("phase-panel").hidden = !show;
    $("lesson-toggle").setAttribute("aria-expanded", String(show));
    $("lesson-toggle").setAttribute("aria-label", show ? "Collapse lesson" : "Expand lesson");
    if (remember) { memory.layout.lessonOpen = show; save(); }
  }
  function openReference(show) {
    $("reference").hidden = !show;
    $("app-layout").classList.toggle("reference-open", show);
    $("reference-toggle").setAttribute("aria-expanded", String(show));
    if (cm) requestAnimationFrame(() => cm.refresh());
  }
  function setFocus(show) {
    focusMode = show;
    if (show) openReference(false);
    document.body.classList.toggle("focus-mode", show);
    $("focus-toggle").textContent = show ? "Exit focus" : "Focus";
    $("focus-toggle").setAttribute("aria-pressed", String(show));
    if (cm) requestAnimationFrame(() => cm.refresh());
  }
  function theme(next) {
    if (next !== "dark" && next !== "light") return;
    document.body.dataset.theme = next;
    $("theme-toggle").setAttribute("aria-label", next === "dark" ? "Switch to light theme" : "Switch to dark theme");
    memory.theme = next; save();
  }
  function setEditorShare(value) {
    const limited = Math.max(30, Math.min(75, Math.round(value)));
    memory.layout.editorShare = limited;
    document.documentElement.style.setProperty("--editor-share", limited + "%");
    $("horizontal-resizer").setAttribute("aria-valuenow", String(limited));
    if (cm) requestAnimationFrame(() => cm.refresh());
  }
  function setConsoleHeight(value) {
    const limited = Math.max(100, Math.min(380, Math.round(value)));
    memory.layout.consoleHeight = limited;
    document.documentElement.style.setProperty("--console-height", limited + "px");
    $("vertical-resizer").setAttribute("aria-valuenow", String(limited));
  }
  function configureResizableHandle(id, axis, start, setter, keyStep, range) {
    const handle = $(id);
    handle.addEventListener("pointerdown", event => {
      if (event.button !== 0 || (axis === "x" && window.matchMedia("(max-width: 1050px)").matches)) return;
      event.preventDefault();
      dividerDrag = { id, axis, startPos: axis === "x" ? event.clientX : event.clientY, initial: start(), width: $("workspace-grid").getBoundingClientRect().width };
      document.body.classList.add(axis === "x" ? "is-resizing" : "is-resizing-row");
      handle.setPointerCapture(event.pointerId);
    });
    handle.addEventListener("pointermove", event => {
      if (!dividerDrag || dividerDrag.id !== id) return;
      const delta = axis === "x" ? event.clientX - dividerDrag.startPos : event.clientY - dividerDrag.startPos;
      setter(axis === "x" ? dividerDrag.initial + delta / dividerDrag.width * 100 : dividerDrag.initial - delta);
    });
    const stop = () => {
      if (!dividerDrag || dividerDrag.id !== id) return;
      dividerDrag = null;
      document.body.classList.remove("is-resizing", "is-resizing-row");
      save();
    };
    handle.addEventListener("pointerup", stop);
    handle.addEventListener("pointercancel", stop);
    handle.addEventListener("keydown", event => {
      const along = axis === "x" ? ["ArrowLeft", "ArrowRight"] : ["ArrowUp", "ArrowDown"];
      if (![...along, "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "Home") setter(range[0]);
      else if (event.key === "End") setter(range[1]);
      else setter(start() + (event.key === along[0] ? -keyStep : keyStep));
      save();
    });
  }

  function fitImageDisplays() {
    if (!hasImage || !originalImage) return;
    for (const [frameID, imageID, dimensions] of [
      ["source-image-frame", "image-preview", originalImage],
      ["comparison-image-frame", "comparison-preview", comparisonImage]
    ]) {
      if (!dimensions || $(frameID).hidden) continue;
      const frame = $(frameID);
      const availableWidth = frame.clientWidth, availableHeight = frame.clientHeight;
      if (!availableWidth || !availableHeight) continue;
      const fraction = Math.min(availableWidth / dimensions.width, availableHeight / dimensions.height);
      const image = $(imageID);
      image.style.width = Math.max(1, Math.floor(dimensions.width * fraction)) + "px";
      image.style.height = Math.max(1, Math.floor(dimensions.height * fraction)) + "px";
    }
  }
  function transformImage() {
    const transform = "translate(" + imageX + "px," + imageY + "px) scale(" + imageScale + ")";
    $("image-preview").style.transform = transform;
    $("comparison-preview").style.transform = transform;
    $("image-zoom").textContent = hasImage ? Math.round(imageScale * 100) + "%" : "—";
  }
  function resetImageView() {
    imageScale = 1; imageX = 0; imageY = 0; transformImage();
  }
  function scaleImage(factor) {
    if (!hasImage) return;
    imageScale = Math.max(.25, Math.min(8, +(imageScale * factor).toFixed(3)));
    if (imageScale <= 1) { imageX = 0; imageY = 0; }
    transformImage();
  }

  function renderChannel() {
    if (!hasImage || !originalImage || !pixelData) return;
    const selected = $("preview-channel").value;
    if (selected === "rgb") { $("image-preview").src = imageURL; return; }
    const canvas = document.createElement("canvas");
    canvas.width = pixelWidth; canvas.height = pixelHeight;
    const context = canvas.getContext("2d", { willReadFrequently: false });
    if (!context) return;
    const filtered = context.createImageData(pixelWidth, pixelHeight);
    const raw = pixelData.data, dest = filtered.data;
    for (let i = 0; i < raw.length; i += 4) {
      let r = raw[i], g = raw[i + 1], b = raw[i + 2];
      if (selected === "red") { g = 0; b = 0; }
      else if (selected === "green") { r = 0; b = 0; }
      else if (selected === "blue") { r = 0; g = 0; }
      else if (selected === "gray") {
        const v = Math.round(.2126 * r + .7152 * g + .0722 * b);
        r = v; g = v; b = v;
      }
      dest[i] = r; dest[i + 1] = g; dest[i + 2] = b; dest[i + 3] = raw[i + 3];
    }
    context.putImageData(filtered, 0, 0);
    $("image-preview").src = canvas.toDataURL("image/png");
  }
  function openImage(file) {
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp", "image/gif"].includes(file.type)) {
      $("image-meta").textContent = /\.tiff?$/i.test(file.name) ? "TIFF/OME-TIFF preview not connected" : "Unsupported preview format";
      return;
    }
    // Preview only: RGB browser pixels, not calibrated microscopy intensities.
    const candidate = URL.createObjectURL(file);
    const checker = new Image();
    $("image-loading").hidden = false;
    checker.onload = () => {
      $("image-loading").hidden = true;
      const width = checker.naturalWidth, height = checker.naturalHeight;
      const scale = Math.min(1, 2048 / Math.max(width, height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      const context = canvas.getContext("2d", {willReadFrequently:true});
      if (context) {
        try {
          context.drawImage(checker, 0, 0, canvas.width, canvas.height);
          pixelData = context.getImageData(0, 0, canvas.width, canvas.height);
          pixelWidth = canvas.width; pixelHeight = canvas.height;
        } catch { pixelData = null; pixelWidth = 0; pixelHeight = 0; }
      }
      if (imageURL) URL.revokeObjectURL(imageURL);
      imageURL = candidate; originalImage = {width, height};
      hasImage = true;
      $("image-preview").src = candidate;
      $("image-preview").hidden = false;
      $("source-image-frame").hidden = false;
      $("image-empty").hidden = true;
      $("image-canvas").classList.add("loaded");
      $("image-meta").textContent = file.name + " · " + width + " × " + height + " px";
      $("image-meta").title = "Browser RGB preview only — not a calibrated TIFF";
      $("preview-channel").disabled = !pixelData;
      $("preview-channel").value = "rgb";
      for (const id of ["zoom-in", "zoom-out", "zoom-reset"]) $(id).disabled = false;
      $("compare-toggle").disabled = false;
      updateComparison();
      resetImageView();
      requestAnimationFrame(fitImageDisplays);
    };
    checker.onerror = () => {
      URL.revokeObjectURL(candidate);
      $("image-loading").hidden = true;
      $("image-meta").textContent = "Could not open image";
    };
    checker.src = candidate;
  }

  // Comparison is visual only. No alignment, segmentation or quantified analysis is inferred.
  function updateComparison() {
    const canvas = $("image-canvas");
    canvas.classList.remove("comparison-side", "comparison-overlay", "comparison-wipe");
    const valid = compareEnabled && hasImage && !!comparisonImage;
    $("comparison-image-frame").hidden = !valid;
    $("opacity-tools").hidden = true;
    if (!valid) { requestAnimationFrame(fitImageDisplays); return; }
    const matched = originalImage.width === comparisonImage.width &&
      originalImage.height === comparisonImage.height;
    const overlay = $("comparison-mode").querySelector('option[value="overlay"]');
    const wipe = $("comparison-mode").querySelector('option[value="wipe"]');
    overlay.disabled = !matched;
    wipe.disabled = !matched;
    if (!matched && $("comparison-mode").value !== "side") $("comparison-mode").value = "side";
    const mode = $("comparison-mode").value;
    canvas.classList.add("comparison-" + mode);
    $("comparison-opacity").disabled = mode === "side";
    $("opacity-tools").hidden = mode === "side";
    const pct = Number($("comparison-opacity").value);
    $("comparison-opacity-value").textContent = mode === "side" ? "—" : pct + "%";
    const frame = $("comparison-image-frame");
    frame.style.opacity = mode === "overlay" ? String(pct / 100) : "1";
    frame.style.clipPath = mode === "wipe" ? "inset(0 " + (100 - pct) + "% 0 0)" : "";
    const notice = $("comparison-notice");
    notice.hidden = matched;
    notice.textContent = matched ? "" : "Dimensions differ. Only side-by-side comparison is available; no alignment has been applied.";
    transformImage();
    requestAnimationFrame(fitImageDisplays);
  }
  function enableComparison(enable) {
    compareEnabled = !!enable;
    $("comparison-tools").hidden = !compareEnabled;
    $("compare-toggle").setAttribute("aria-expanded", String(compareEnabled));
    $("compare-toggle").classList.toggle("is-active", compareEnabled);
    updateComparison();
  }
  function openComparison(file) {
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp", "image/gif"].includes(file.type)) {
      $("comparison-filename").textContent = "Unsupported comparison file";
      return;
    }
    const candidate = URL.createObjectURL(file);
    const checker = new Image();
    checker.onload = () => {
      if (comparisonURL) URL.revokeObjectURL(comparisonURL);
      comparisonURL = candidate;
      comparisonImage = { width: checker.naturalWidth, height: checker.naturalHeight };
      $("comparison-preview").src = candidate;
      $("comparison-preview").hidden = false;
      $("comparison-filename").textContent = file.name;
      $("comparison-filename").title = file.name;
      $("comparison-mode").disabled = false;
      updateComparison();
    };
    checker.onerror = () => {
      URL.revokeObjectURL(candidate);
      $("comparison-filename").textContent = "Could not read comparison image";
    };
    checker.src = candidate;
  }

  function inspectPixel(event) {
    if (!hasImage || !originalImage) return;
    const bounds = $("image-preview").getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width;
    const py = (event.clientY - bounds.top) / bounds.height;
    if (px < 0 || py < 0 || px >= 1 || py >= 1) { $("pixel-readout").textContent = "x — y —"; return; }
    const x = Math.min(originalImage.width - 1, Math.floor(px * originalImage.width));
    const y = Math.min(originalImage.height - 1, Math.floor(py * originalImage.height));
    let detail = "x " + x + "  y " + y;
    if (pixelData) {
      const dx = Math.min(pixelWidth - 1, Math.floor(px * pixelWidth));
      const dy = Math.min(pixelHeight - 1, Math.floor(py * pixelHeight));
      const index = (dy * pixelWidth + dx) * 4;
      const data = pixelData.data;
      detail += "  RGB " + data[index] + "," + data[index + 1] + "," + data[index + 2];
    }
    $("pixel-readout").textContent = detail;
  }

  startEditor();
  theme(memory.theme);
  setEditorShare(memory.layout.editorShare);
  setConsoleHeight(memory.layout.consoleHeight);
  openLesson(memory.layout.lessonOpen, false);
  chooseStage("Python");
  choosePhase("learn");
  chooseResult("output");

  $("clear-code").addEventListener("click", () => {
    if (getCode() && !window.confirm("Clear the current editor draft?")) return;
    setCode(""); saveEditor();
    if (cm) cm.focus(); else $("code-editor").focus();
  });
  document.querySelectorAll("[data-stage]").forEach(item => item.addEventListener("click", () => chooseStage(item.dataset.stage)));
  document.querySelectorAll("[data-mode]").forEach(item => item.addEventListener("click", () => switchMode(item.dataset.mode)));
  document.querySelectorAll("[data-phase]").forEach(item => {
    item.addEventListener("click", () => choosePhase(item.dataset.phase));
    item.addEventListener("keydown", event => {
      if (!["ArrowLeft","ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const order=["learn","apply","prove"];
      const next=order[(order.indexOf(phase)+(event.key==="ArrowRight"?1:2))%3];
      choosePhase(next); $("tab-"+next).focus();
    });
  });
  document.querySelectorAll("[data-result]").forEach(item => {
    item.addEventListener("click", () => chooseResult(item.dataset.result));
    item.addEventListener("keydown", event => {
      if (!["ArrowLeft","ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const order=["output","measurements","histogram"];
      const next=order[(order.indexOf(result)+(event.key==="ArrowRight"?1:2))%3];
      chooseResult(next); $("result-"+next).focus();
    });
  });
  $("lesson-toggle").addEventListener("click", () => openLesson($("phase-panel").hidden));
  $("reference-toggle").addEventListener("click", () => openReference($("reference").hidden));
  $("reference-close").addEventListener("click", () => openReference(false));
  $("focus-toggle").addEventListener("click", () => setFocus(!focusMode));
  $("theme-toggle").addEventListener("click", () => theme(memory.theme === "dark" ? "light" : "dark"));
  $("nav-toggle").addEventListener("click", () => {
    const show = !$("sidebar").classList.contains("open");
    $("sidebar").classList.toggle("open", show);
    $("nav-toggle").setAttribute("aria-expanded", String(show));
  });
  $("image-upload").addEventListener("change", event => {
    openImage(event.target.files?.[0]); event.target.value = "";
  });
  document.querySelector(".load-button").addEventListener("keydown", event => {
    if (event.key === " " || event.key === "Enter") { event.preventDefault(); $("image-upload").click(); }
  });
  $("preview-channel").addEventListener("change", renderChannel);
  $("compare-toggle").addEventListener("click", () => enableComparison(!compareEnabled));
  $("comparison-upload").addEventListener("change", event => {
    openComparison(event.target.files?.[0]);
    event.target.value = "";
  });
  document.querySelector('label[for="comparison-upload"]').addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault(); $("comparison-upload").click();
    }
  });
  $("comparison-mode").addEventListener("change", updateComparison);
  $("comparison-opacity").addEventListener("input", updateComparison);
  $("zoom-in").addEventListener("click", () => scaleImage(1.25));
  $("zoom-out").addEventListener("click", () => scaleImage(1/1.25));
  $("zoom-reset").addEventListener("click", resetImageView);
  $("image-canvas").addEventListener("wheel", event => {
    if (!hasImage) return;
    event.preventDefault(); scaleImage(event.deltaY < 0 ? 1.12 : 1/1.12);
  }, {passive:false});
  $("image-canvas").addEventListener("pointerdown", event => {
    if (!hasImage || imageScale <= 1 || event.button !== 0) return;
    drag = {x:event.clientX - imageX, y:event.clientY - imageY};
    $("image-canvas").classList.add("dragging");
    $("image-canvas").setPointerCapture(event.pointerId);
  });
  $("image-canvas").addEventListener("pointermove", event => {
    if (drag) { imageX=event.clientX-drag.x; imageY=event.clientY-drag.y; transformImage(); }
    inspectPixel(event);
  });
  const stopImageDrag = () => { drag=null; $("image-canvas").classList.remove("dragging"); };
  $("image-canvas").addEventListener("pointerup", stopImageDrag);
  $("image-canvas").addEventListener("pointercancel", stopImageDrag);
  $("image-canvas").addEventListener("pointerleave", () => $("pixel-readout").textContent = "x — y —");
  $("image-canvas").addEventListener("dragover", event => { if (mode === "image") event.preventDefault(); });
  $("image-canvas").addEventListener("drop", event => {
    event.preventDefault();
    if (mode === "image") openImage(event.dataTransfer?.files?.[0]);
  });
  configureResizableHandle("horizontal-resizer", "x", () => memory.layout.editorShare, setEditorShare, 5, [30,75]);
  configureResizableHandle("vertical-resizer", "y", () => memory.layout.consoleHeight, setConsoleHeight, 20, [100,380]);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (focusMode) setFocus(false);
      openReference(false);
      $("sidebar").classList.remove("open");
      $("nav-toggle").setAttribute("aria-expanded", "false");
    }
  });
  window.addEventListener("beforeunload", () => {
    if (imageURL) URL.revokeObjectURL(imageURL);
    if (comparisonURL) URL.revokeObjectURL(comparisonURL);
  });
  window.addEventListener("resize", () => { if (cm) { cm.setOption("lineWrapping", window.innerWidth <= 900); cm.refresh(); } fitImageDisplays(); });
  if (typeof ResizeObserver === "function") {
    const imageObserver = new ResizeObserver(fitImageDisplays);
    imageObserver.observe($("image-canvas"));
    imageObserver.observe($("source-image-frame"));
    imageObserver.observe($("comparison-image-frame"));
  }
  window.BioPythonStudioBridge = Object.freeze({
    readCode: getCode,
    writeCode: setCode,
    selectPhase: choosePhase,
    expandLesson: show => openLesson(Boolean(show))
  });
  $("run-button").disabled = true;
  $("compare-toggle").disabled = true;
})();
