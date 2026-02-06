import { useMemo, useState } from "react";

export default function App() {
  const [form, setForm] = useState({
    height_in: 74,
    inseam_in: 35,
    riding_style: "endurance",
    flexibility: "medium",
    pain_points: [],
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const painOptions = useMemo(
    () => [
      ["hand_numbness", "Hand numbness", "🖐️"],
      ["knee_front", "Front knee pain", "🦵"],
      ["knee_back", "Back knee pain", "🦵"],
      ["neck_pain", "Neck pain", "🧠"],
      ["lower_back_pain", "Lower back pain", "🧍"],
      ["hip_pain", "Hip pain", "🦴"],
    ],
    []
  );

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name.includes("_in") ? Number(value) : value,
    }));
  };

  const togglePain = (key) => {
    setForm((prev) => {
      const has = prev.pain_points.includes(key);
      return {
        ...prev,
        pain_points: has
          ? prev.pain_points.filter((p) => p !== key)
          : [...prev.pain_points, key],
      };
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Request failed");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const confidencePct = Math.round(((result?.confidence ?? 0) * 100 + Number.EPSILON) * 1) / 1;

  return (
    <div className="min-vh-100 py-5" style={styles.bg}>
      <div className="container" style={{ maxWidth: 980 }}>
        <div className="mb-4 text-white">
          <span className="badge rounded-pill me-2" style={styles.badge}>
            ✨ Smart fit • fast feedback
          </span>
          <h1 className="display-5 fw-bold mt-3">AI Bike Fit Advisor</h1>
          <p className="lead opacity-75 mb-0">
            Enter your basics, add any pain points, and get a starting fit estimate you can test on a short ride.
          </p>
        </div>

        <div className="row g-4">
          {/* Inputs */}
          <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-lg" style={styles.card}>
              <div className="card-body p-4 p-md-5">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div>
                    <h2 className="h4 fw-bold mb-1 text-white">Inputs</h2>
                    <div className="text-white-50 small">Keep it simple: one adjustment at a time, then retest.</div>
                  </div>
                  <div style={styles.iconBlock} />
                </div>

                <form onSubmit={submit}>
                  <div className="row g-3">
                    <div className="col-12 col-sm-6">
                      <label className="form-label text-white-75">Height (in)</label>
                      <input
                        className="form-control form-control-lg"
                        style={styles.input}
                        name="height_in"
                        type="number"
                        step="0.1"
                        value={form.height_in}
                        onChange={onChange}
                      />
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label text-white-75">Inseam (in)</label>
                      <input
                        className="form-control form-control-lg"
                        style={styles.input}
                        name="inseam_in"
                        type="number"
                        step="0.1"
                        value={form.inseam_in}
                        onChange={onChange}
                      />
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label text-white-75">Riding style</label>
                      <select
                        className="form-select form-select-lg"
                        style={styles.input}
                        name="riding_style"
                        value={form.riding_style}
                        onChange={onChange}
                      >
                        <option value="endurance">endurance</option>
                        <option value="race">race</option>
                        <option value="gravel">gravel</option>
                        <option value="commute">commute</option>
                      </select>
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label text-white-75">Flexibility</label>
                      <select
                        className="form-select form-select-lg"
                        style={styles.input}
                        name="flexibility"
                        value={form.flexibility}
                        onChange={onChange}
                      >
                        <option value="low">low</option>
                        <option value="medium">medium</option>
                        <option value="high">high</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 p-3 p-md-4 rounded-4" style={styles.panel}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="fw-bold text-white">Pain points</div>
                      <div className="text-white-50 small">optional</div>
                    </div>

                    <div className="mt-3 d-flex flex-wrap gap-2">
                      {painOptions.map(([key, label, icon]) => {
                        const active = form.pain_points.includes(key);
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => togglePain(key)}
                            className="btn btn-sm rounded-pill"
                            style={active ? styles.pillOn : styles.pillOff}
                          >
                            <span className="me-2">{icon}</span>
                            {label}
                            <span className="ms-2 badge rounded-pill" style={active ? styles.pillBadgeOn : styles.pillBadgeOff}>
                              {active ? "ON" : "OFF"}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="text-white-50 small mt-3">
                      Pick what you feel during rides and we will prioritize the best first adjustment.
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="btn btn-lg w-100 mt-4" style={styles.cta}>
                    {loading ? "Calculating..." : "Get Fit Estimate"}
                  </button>

                  {error && (
                    <div className="alert alert-danger mt-3 mb-0" role="alert">
                      {error}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-lg" style={styles.card}>
              <div className="card-body p-4 p-md-5">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div>
                    <h2 className="h4 fw-bold mb-1 text-white">Results</h2>
                    <div className="text-white-50 small">Your starting point. Adjust in small steps and retest.</div>
                  </div>
                  <div style={styles.iconBlock2} />
                </div>

                {!result ? (
                  <div className="p-4 rounded-4" style={styles.panel}>
                    <div className="text-white-50">Run an estimate to see your fit guidance here.</div>
                  </div>
                ) : (
                  <>
                    <div className="p-4 rounded-4 mb-3" style={styles.panel}>
                      <div className="text-white-50 small">Saddle height</div>
                      <div className="text-white display-6 fw-bold mb-2">
                        {result.saddle_height_in} in{" "}
                        <span className="fs-6 fw-semibold text-white-50">
                          ({result.saddle_height_cm} cm)
                        </span>
                      </div>

                      <div className="text-white-50 small">Recommended range</div>
                      <div className="text-white fw-semibold">
                        {result.saddle_height_range_in[0]}–{result.saddle_height_range_in[1]} in{" "}
                        <span className="text-white-50 fw-normal">
                          ({result.saddle_height_range_cm[0]}–{result.saddle_height_range_cm[1]} cm)
                        </span>
                      </div>

                      <div className="mt-4">
                        <div className="d-flex justify-content-between small text-white-50">
                          <span>Confidence</span>
                          <span>{confidencePct}%</span>
                        </div>
                        <div className="progress mt-2" style={{ height: 10, background: "rgba(255,255,255,0.08)" }}>
                          <div className="progress-bar" role="progressbar" style={{ width: `${confidencePct}%`, ...styles.progress }} />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-4 mb-3" style={styles.panel}>
                      <div className="text-white mb-2">
                        <span className="fw-bold">Reach:</span> <span className="text-white-75">{result.reach_guidance}</span>
                      </div>
                      <div className="text-white mb-2">
                        <span className="fw-bold">Bar drop:</span> <span className="text-white-75">{result.bar_drop_guidance}</span>
                      </div>
                      <div className="text-white">
                        <span className="fw-bold">Geometry:</span> <span className="text-white-75">{result.geometry_guidance}</span>
                      </div>
                    </div>

                    {result.pain_analysis?.length > 0 && (
                      <div className="p-4 rounded-4 mb-3" style={styles.panel}>
                        <div className="fw-bold text-white mb-2">Pain guidance</div>
                        {result.priority_adjustment && (
                          <div className="text-white-75 mb-3">
                            <span className="fw-bold text-white">Priority:</span> {result.priority_adjustment}
                          </div>
                        )}

                        {result.pain_analysis.map((p, idx) => (
                          <div key={idx} className="p-3 rounded-4 mb-3" style={styles.panelInner}>
                            <div className="fw-bold text-white">{p.label}</div>
                            <ul className="mt-2 mb-2 text-white-75">
                              {p.likely_causes.map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                            <div className="text-white-75">
                              <span className="fw-bold text-white">First adjustment:</span> {p.first_adjustment}
                            </div>
                            <div className="text-white-50 small mt-1">
                              <span className="fw-bold text-white-75">Caution:</span> {p.caution}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {result.notes?.length > 0 && (
                      <div className="p-4 rounded-4 mb-3" style={styles.panel}>
                        <div className="fw-bold text-white mb-2">Notes</div>
                        <ul className="mb-0 text-white-75">
                          {result.notes.map((n, i) => (
                            <li key={i}>{n}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="p-4 rounded-4" style={styles.panel}>
                      <div className="text-white-75">
                        <span className="fw-bold text-white">Next adjustment:</span> {result.next_adjustment}
                      </div>
                      <div className="text-white-50 small mt-2">{result.disclaimer}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="text-white-50 small mt-4">
          Built locally at C:\Users\Shelby Joiner\Documents\Personal\RideFitAI
        </div>
      </div>
    </div>
  );
}

const styles = {
  bg: {
    background:
      "radial-gradient(900px 600px at 10% 10%, rgba(217,70,239,0.18), transparent 60%), " +
      "radial-gradient(900px 600px at 90% 20%, rgba(34,211,238,0.16), transparent 60%), " +
      "radial-gradient(900px 700px at 55% 90%, rgba(52,211,153,0.12), transparent 60%), " +
      "linear-gradient(180deg, #05070f, #070b16)",
  },
  badge: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
  },
  card: {
    background: "rgba(255,255,255,0.06)",
    borderRadius: 24,
    backdropFilter: "blur(14px)",
  },
  panel: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.10)",
  },
  panelInner: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
  },
  input: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "white",
  },
  cta: {
    borderRadius: 18,
    border: "0",
    color: "#08101a",
    fontWeight: 800,
    background: "linear-gradient(90deg, rgba(34,211,238,1), rgba(59,130,246,1), rgba(217,70,239,1))",
    boxShadow: "0 14px 30px rgba(217,70,239,0.10)",
  },
  progress: {
    background: "linear-gradient(90deg, rgba(52,211,153,1), rgba(34,211,238,1), rgba(217,70,239,1))",
  },
  pillOff: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.14)",
    color: "rgba(255,255,255,0.88)",
  },
  pillOn: {
    background: "linear-gradient(90deg, rgba(34,211,238,0.16), rgba(217,70,239,0.16))",
    border: "1px solid rgba(34,211,238,0.35)",
    color: "white",
    boxShadow: "0 10px 24px rgba(34,211,238,0.08)",
  },
  pillBadgeOff: {
    background: "rgba(255,255,255,0.10)",
    color: "rgba(255,255,255,0.75)",
  },
  pillBadgeOn: {
    background: "rgba(255,255,255,0.16)",
    color: "white",
  },
  iconBlock: {
    height: 40,
    width: 40,
    borderRadius: 14,
    background: "linear-gradient(135deg, rgba(34,211,238,0.25), rgba(217,70,239,0.25))",
    border: "1px solid rgba(255,255,255,0.12)",
  },
  iconBlock2: {
    height: 40,
    width: 40,
    borderRadius: 14,
    background: "linear-gradient(135deg, rgba(52,211,153,0.22), rgba(34,211,238,0.18))",
    border: "1px solid rgba(255,255,255,0.12)",
  },
};
