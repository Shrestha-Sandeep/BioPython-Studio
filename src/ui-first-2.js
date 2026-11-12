/* Minimal UI layer: view selection and step navigation only.
 * The lesson, runner, files, checks and saved progress remain owned by the course adapter.
 */
"use strict";
(() => {
  const $ = id => document.getElementById(id);
  const body = document.body;
  const KEY = "biopython.ui-first-2.v1";
  const phases = ["learn", "apply", "prove"];
  const stageLabels = {Python:"Python", Microscopy:"Images", NGS:"Sequences", ML:"Models"};
  let view = "learn";
  let mobilePane = "code";
  let current = null;
  let lastTask = null;

  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (saved && ["learn", "explore"].includes(saved.view)) view = saved.view;
    if (saved && ["code", "image", "result"].includes(saved.mobilePane)) mobilePane = saved.mobilePane;
  } catch { /* Storage is optional. */ }

  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify({view, mobilePane})); }
    catch { /* Users can still navigate without persistence. */ }
  };
  function refreshEditor() {
    requestAnimationFrame(() => {
      const cm = document.querySelector(".CodeMirror")?.CodeMirror;
      if (cm) cm.refresh();
      window.dispatchEvent(new Event("resize"));
    });
  }
  function setTitle() {
    const stage = current?.stage || document.querySelector('[data-stage][aria-current="page"]')?.dataset.stage || "Python";
    $("top-section").textContent = stageLabels[stage] || "Python";
    $("page-title").textContent = view === "learn" ? (current?.title || "Python") :
      (stage === "Microscopy" ? "Images" : "Code");
  }
  function setMobilePane(next, persist = true) {
    if (!["code", "image", "result"].includes(next)) return;
    if (next === "image" && $("image-panel").hidden) next = "code";
    mobilePane = next;
    body.dataset.mobilePane = next;
    document.querySelectorAll("[data-mobile-target]").forEach(button => {
      const active = button.dataset.mobileTarget === next;
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    });
    if (persist) save();
    refreshEditor();
  }
  function syncMobileViews() {
    const available = !$("image-panel").hidden;
    $("mobile-pane-image").hidden = !available;
    if (!available && mobilePane === "image") setMobilePane("code");
    else setMobilePane(mobilePane, false);
  }
  function updateRuntime() {
    const text = document.querySelector(".runtime-state")?.textContent || "";
    body.classList.toggle("runtime-warning", /\b(loading|running|unavailable|error|failed|blocked|cannot)\b/i.test(text));
  }
  function closeNav() {
    $("sidebar").classList.remove("open");
    $("nav-toggle").setAttribute("aria-expanded", "false");
  }
  function setView(next) {
    if (!["learn", "explore"].includes(next)) return;
    view = next;
    body.dataset.uiView = next;
    $("view-learn").setAttribute("aria-pressed", String(next === "learn"));
    $("view-explore").setAttribute("aria-pressed", String(next === "explore"));
    if (next === "learn") {
      if ($("focus-toggle").getAttribute("aria-pressed") === "true") $("focus-toggle").click();
      if ($("reference-toggle").getAttribute("aria-expanded") === "true") $("reference-toggle").click();
      body.classList.remove("nav-collapsed");
      window.BioPythonStudioBridge?.expandLesson?.(true);
      // The measurements/histogram tabs are deliberately Explore-only.
      if ($("result-output").getAttribute("aria-selected") !== "true") $("result-output").click();
    }
    closeNav();
    setTitle();
    updateRuntime();
    syncMobileViews();
    save();
    refreshEditor();
  }
  function syncProgress() {
    const holder = $("guided-nav");
    const ready = !!current && !!$("p01-goal-select");
    holder.hidden = !ready;
    if (!ready) return;
    const index = current.goalIndex + 1;
    const total = current.goalCount;
    $("guided-position").textContent = "Task " + index + " / " + total;
    $("guided-back").disabled = index === 1 && current.phase === "learn";
    $("guided-next").disabled = index === total && current.phase === "prove";
  }
  function onLessonChange(event) {
    const next = event.detail;
    if (!next || typeof next.title !== "string") return;
    const task = next.chapterId + ":" + next.goalIndex + ":" + next.phase;
    current = next;
    setTitle();
    syncProgress();
    syncMobileViews();
    // Every new phase/task starts with its code, not the previous phase's output.
    if (lastTask && lastTask !== task && view === "learn") setMobilePane("code");
    lastTask = task;
  }
  function move(direction) {
    if (!current || !["learn", "apply", "prove"].includes(current.phase)) return;
    const i = phases.indexOf(current.phase);
    const next = i + direction;
    if (next >= 0 && next < phases.length) {
      document.querySelector('[data-phase="' + phases[next] + '"]')?.click();
      return;
    }
    const select = $("p01-goal-select");
    if (!select) return;
    const goal = current.goalIndex + direction;
    if (goal < 0 || goal >= current.goalCount) return;
    select.value = String(goal);
    select.dispatchEvent(new Event("change", {bubbles:true}));
    if (direction < 0) document.querySelector('[data-phase="prove"]')?.click();
  }

  $("view-learn").addEventListener("click", () => setView("learn"));
  $("view-explore").addEventListener("click", () => setView("explore"));
  $("guided-back").addEventListener("click", () => move(-1));
  $("guided-next").addEventListener("click", () => move(1));

  document.querySelectorAll("[data-mobile-target]").forEach(button => {
    button.addEventListener("click", () => setMobilePane(button.dataset.mobileTarget));
    button.addEventListener("keydown", event => {
      if (!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return;
      const enabled = [...document.querySelectorAll("[data-mobile-target]:not([hidden])")];
      let index = enabled.indexOf(button);
      if (event.key === "Home") index = 0;
      else if (event.key === "End") index = enabled.length - 1;
      else index = (index + (event.key === "ArrowRight" ? 1 : enabled.length - 1)) % enabled.length;
      event.preventDefault();
      enabled[index]?.focus();
      enabled[index]?.click();
    });
  });
  // Existing runner remains unchanged. On a small display show its output after Run.
  $("run-button").addEventListener("click", () => {
    if (window.matchMedia("(max-width:720px)").matches) setMobilePane("result");
  });
  $("nav-toggle").addEventListener("click", () => {
    if (window.matchMedia("(min-width:721px)").matches && view === "learn") {
      body.classList.toggle("nav-collapsed");
      $("nav-toggle").setAttribute("aria-expanded", String(!body.classList.contains("nav-collapsed")));
      refreshEditor();
    }
  });
  document.querySelectorAll("[data-stage]").forEach(button => button.addEventListener("click", () => {
    if (view === "learn") body.classList.remove("nav-collapsed");
    closeNav();
    requestAnimationFrame(syncMobileViews);
  }));
  const imageObserver = new MutationObserver(syncMobileViews);
  imageObserver.observe($("image-panel"), {attributes:true,attributeFilter:["hidden"]});
  const statusNode = document.querySelector(".runtime-state");
  if (statusNode) new MutationObserver(updateRuntime).observe(statusNode, {childList:true,subtree:true,characterData:true});
  document.addEventListener("bps:lesson-change", onLessonChange);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && window.matchMedia("(min-width:721px)").matches) {
      closeNav();
    }
  });

  setView(view);
  setMobilePane(mobilePane, false);
  syncProgress();
  updateRuntime();
})();
