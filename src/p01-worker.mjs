/* BioPython Studio — genuine Python execution in a dedicated Worker.
 * Pyodide is version-pinned. Browser network is needed on first load.
 * A Web Worker avoids UI blocking but is NOT a hardened security sandbox.
 * Reference solutions and private grading are deliberately absent.
 */
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.mjs";
const INDEX = "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/";
let instance = null;
let startup = null;
async function ready() {
  if (!startup) startup = loadPyodide({ indexURL: INDEX }).then(runtime => {
    instance = runtime;
    return runtime;
  }).catch(error => { startup = null; throw error; });
  return startup;
}
const PYTHON_RUNNER = String.raw`import json, io, contextlib, traceback, os, sys, base64
os.environ.setdefault('MPLBACKEND', 'agg')
_bps_env = {"__name__": "__main__"}
_bps_env.update(json.loads(__bps_inputs_json))
_bps_out = io.StringIO()
_bps_err = io.StringIO()
_bps_error = ""
_bps_results = []
_bps_figures = []
try:
    with contextlib.redirect_stdout(_bps_out), contextlib.redirect_stderr(_bps_err):
        exec(compile(__bps_source, "<BioPython Studio learner>", "exec"), _bps_env)
except BaseException:
    _bps_error = traceback.format_exc()
if not _bps_error and __bps_render_figures and 'matplotlib.pyplot' in sys.modules:
    try:
        import matplotlib.pyplot as _bps_plt
        for _bps_number in _bps_plt.get_fignums()[:2]:
            _bps_buffer = io.BytesIO()
            _bps_plt.figure(_bps_number).savefig(_bps_buffer, format='png', dpi=92)
            _bps_image = _bps_buffer.getvalue()
            if len(_bps_image) <= 1200000:
                _bps_figures.append('data:image/png;base64,'+base64.b64encode(_bps_image).decode('ascii'))
        _bps_plt.close('all')
    except BaseException:
        _bps_err.write('Figure display could not render; see stdout and traceback.\n')
if not _bps_error:
    for _bps_assertion in json.loads(__bps_assertions_json):
        try:
            _bps_pass = bool(eval(compile(_bps_assertion, "<practice check>", "eval"), _bps_env))
            _bps_results.append({"expression": _bps_assertion, "passed": _bps_pass, "error": ""})
        except BaseException:
            _bps_results.append({"expression": _bps_assertion, "passed": False, "error": traceback.format_exc()})
json.dumps({"stdout": _bps_out.getvalue(), "stderr": _bps_err.getvalue(), "traceback": _bps_error, "checks": _bps_results, "figures": _bps_figures})
`;
let publishedFigureReady = false;
async function preparePython(py, code, cases = []) {
  // Load only packages requested by learner code; never predownload large
  // scientific wheels for P01-P06 standard-library lessons.
  await py.loadPackagesFromImports(code);
  const wantsFigure = /\\bimage_path\\b/.test(code) ||
    cases.some(item=>Object.prototype.hasOwnProperty.call(item.inputs||{},'image_path'));
  if (wantsFigure && !publishedFigureReady) {
    const source = new URL('../assets/witz/fluorescence-single.png', import.meta.url);
    const r = await fetch(source);
    if (!r.ok) throw new Error('Published Witz/HPA teaching figure could not load (HTTP '+r.status+'). No fabricated fallback image.');
    const bytes = new Uint8Array(await r.arrayBuffer());
    if (bytes.length < 100 || bytes.length > 12000000) throw new Error('Source figure size is unexpected; refusing corrupt training data.');
    py.FS.writeFile('/home/pyodide/witz_published_figure.png', bytes);
    publishedFigureReady = true;
  }
}
function runCode(pyodide, code, inputs = {}, assertions = [], renderFigures = false) {
  // Convert nested JSON through Python's parser instead of shallow JS->Py proxies.
  // This guarantees a field pair [id, null] becomes [id, None], not a JS null proxy.
  // All chapter data are JSON-compatible; expressions remain evaluation fixtures.
  pyodide.globals.set("__bps_source", code);
  pyodide.globals.set("__bps_inputs_json", JSON.stringify(inputs));
  pyodide.globals.set("__bps_assertions_json", JSON.stringify(assertions));
  pyodide.globals.set("__bps_render_figures", Boolean(renderFigures));
  try {
    return JSON.parse(pyodide.runPython(PYTHON_RUNNER));
  } finally {
    pyodide.globals.delete("__bps_source");
    pyodide.globals.delete("__bps_inputs_json");
    pyodide.globals.delete("__bps_assertions_json");
    pyodide.globals.delete("__bps_render_figures");
  }
}
self.onmessage = async event => {
  const { id, type, code, inputs, cases } = event.data ?? {};
  if (!Number.isInteger(id) || !["run", "check"].includes(type)) return;
  try {
    if (typeof code !== "string" || code.length > 20000) throw new Error("Python code is empty or exceeds the 20,000-character P01 limit.");
    const py = await ready();
    await preparePython(py, code, type === "check" ? cases ?? [] : [{inputs: inputs ?? {}}]);
    if (type === "run") {
      self.postMessage({ id, ok: true, result: runCode(py, code, inputs ?? {}, [], true) });
      return;
    }
    if (!Array.isArray(cases) || cases.length === 0 || cases.length > 12) throw new Error("Invalid practice-check definition.");
    const results = [];
    for (const item of cases) {
      const current = runCode(py, code, item.inputs ?? {}, item.assertions ?? []);
      results.push(current);
      if (current.traceback || current.checks.some(c => !c.passed)) break;
    }
    self.postMessage({ id, ok: true, results });
  } catch (error) {
    self.postMessage({ id, ok: false, error: String(error?.stack ?? error) });
  }
};
