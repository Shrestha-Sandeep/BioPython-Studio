/* BioPython Studio P01 — genuine Python execution in a dedicated Worker.
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
const PYTHON_RUNNER = String.raw`import json, io, contextlib, traceback
_bps_env = {"__name__": "__main__"}
_bps_env.update(dict(__bps_inputs))
_bps_out = io.StringIO()
_bps_err = io.StringIO()
_bps_error = ""
_bps_results = []
try:
    with contextlib.redirect_stdout(_bps_out), contextlib.redirect_stderr(_bps_err):
        exec(compile(__bps_source, "<BioPython Studio learner>", "exec"), _bps_env)
except BaseException:
    _bps_error = traceback.format_exc()
if not _bps_error:
    for _bps_assertion in list(__bps_assertions):
        try:
            _bps_pass = bool(eval(compile(_bps_assertion, "<practice check>", "eval"), _bps_env))
            _bps_results.append({"expression": _bps_assertion, "passed": _bps_pass, "error": ""})
        except BaseException:
            _bps_results.append({"expression": _bps_assertion, "passed": False, "error": traceback.format_exc()})
json.dumps({"stdout": _bps_out.getvalue(), "stderr": _bps_err.getvalue(), "traceback": _bps_error, "checks": _bps_results})
`;
function runCode(pyodide, code, inputs = {}, assertions = []) {
  const inputProxy = pyodide.toPy(inputs);
  const assertionProxy = pyodide.toPy(assertions);
  try {
    pyodide.globals.set("__bps_source", code);
    pyodide.globals.set("__bps_inputs", inputProxy);
    pyodide.globals.set("__bps_assertions", assertionProxy);
    return JSON.parse(pyodide.runPython(PYTHON_RUNNER));
  } finally {
    pyodide.globals.delete("__bps_source");
    pyodide.globals.delete("__bps_inputs");
    pyodide.globals.delete("__bps_assertions");
    inputProxy.destroy();
    assertionProxy.destroy();
  }
}
self.onmessage = async event => {
  const { id, type, code, inputs, cases } = event.data ?? {};
  if (!Number.isInteger(id) || !["run", "check"].includes(type)) return;
  try {
    if (typeof code !== "string" || code.length > 20000) throw new Error("Python code is empty or exceeds the 20,000-character P01 limit.");
    const py = await ready();
    if (type === "run") {
      self.postMessage({ id, ok: true, result: runCode(py, code, inputs ?? {}) });
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
