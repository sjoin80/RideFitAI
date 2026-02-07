import { useMemo, useState } from "react";
import { Analytics } from "@vercel/analytics/react";

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

  // Base API URL
  // Uses Vercel env var in production
  // Falls back to localhost for local development
  const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
  ).replace(/\/$/, "");

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
      const res = await fetch(`${API_BASE_URL}/fit`, {
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
    <div className="min-vh-100 py-4 py-md-5">
      <div className="container rf-wrap">
        {/* top pill */}
        <div className="rf-pill mb-3">
          <span>✨</span>
          <span className="fw-semibold">Smart fit</span>
          <span className="opacity-50">•</span>
          <span className="rf-muted">fast feedback</span>
        </div>

        {/* header */}
        <h1 className="display-5 fw-bold rf-section-title mb-2">AI Bike Fit Advisor</h1>
        <p className="lead rf-muted rf-subtitle mb-4">
          Enter your basics, add any pain points, and get a starting fit estimate you can test on a short ride.
        </p>

        <div className="row g-4">
          {/* Inputs */}
          <div className="col-12 col-lg-6">
            <div className="card rf-card h-100">
              <div className="card-header py-4 px-4">
                <div className="d-flex justify-content-between align-items-start gap-3">
                  <div>
                    <h2 className="h4 mb-1 fw-bold">Inputs</h2>
                    <div className="rf-muted small">
                      Keep it simple: one adjustment at a time, then retest.
                    </div>
                  </div>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 16,
                      background: "linear-gradient(135deg, rgba(0,195,255,0.30), rgba(187,0,255,0.30))",
                      border: "1px solid rgba(255,255,255,0.10)",
                    }}
                  />
                </div>
              </div>

              <div className="card-body px-4 pb-4">
                <form onSubmit={submit}>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Height (in)</label>
                      <input
                        name="height_in"
                        type="number"
                        step="0.1"
                        value={form.height_in}
                        onChange={onChange}
                        className="form-control rf-input"
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Inseam (in)</label>
                      <input
                        name="inseam_in"
                        type="number"
                        step="0.1"
                        value={form.inseam_in}
                        onChange={onChange}
                        className="form-control rf-input"
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Riding style</label>
                      <select
                        name="riding_style"
                        value={form.riding_style}
                        onChange={onChange}
                        className="form-select rf-select"
                      >
                        <option value="endurance">endurance</option>
                        <option value="race">race</option>
                        <option value="gravel">gravel</option>
                        <option value="commute">commute</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Flexibility</label>
                      <select
                        name="flexibility"
                        value={form.flexibility}
                        onChange={onChange}
                        className="form-select rf-select"
                      >
                        <option value="low">low</option>
                        <option value="medium">medium</option>
                        <option value="high">high</option>
                      </select>
                    </div>

                    {/* Pain points */}
                    <div className="col-12 mt-2">
                      <div className="rf-card p-4">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="fw-bold">Pain points</div>
                          <span className="rf-muted small">optional</span>
                        </div>

                        <div className="d-flex flex-wrap gap-2 mt-3">
                          {painOptions.map(([key, label, icon]) => {
                            const active = form.pain_points.includes(key);
                            return (
                              <button
                                key={key}
                                type="button"
                                onClick={() => togglePain(key)}
                                className={`rf-chip ${active ? "active" : ""}`}
                              >
                                <span>{icon}</span>
                                <span className="fw-semibold">{label}</span>
                                <span className="rf-badge">{active ? "ON" : "OFF"}</span>
                              </button>
                            );
                          })}
                        </div>

                        <div className="rf-muted small mt-3">
                          Pick what you feel during rides and we will prioritize the best first adjustment.
                        </div>
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="col-12 mt-2">
                      <button className="w-100 rf-btn" type="submit" disabled={loading}>
                        {loading ? "Calculating..." : "Get Fit Estimate"}
                      </button>
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="col-12">
                        <div className="alert alert-danger mb-0">
                          {error}
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="col-12 col-lg-6">
            <div className="card rf-card h-100">
              <div className="card-header py-4 px-4">
                <div className="d-flex justify-content-between align-items-start gap-3">
                  <div>
                    <h2 className="h4 mb-1 fw-bold">Results</h2>
                    <div className="rf-muted small">
                      Your starting point. Adjust in small steps and retest.
                    </div>
                  </div>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 16,
                      background: "linear-gradient(135deg, rgba(0,255,170,0.22), rgba(0,195,255,0.22))",
                      border: "1px solid rgba(255,255,255,0.10)",
                    }}
                  />
                </div>
              </div>

              <div className="card-body px-4 pb-4">
                {!result ? (
                  <div className="rf-card p-4 rf-muted">
                    Run an estimate to see your fit guidance here.
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {/* Saddle card */}
                    <div className="rf-card p-4">
                      <div className="rf-muted small">Saddle height</div>
                      <div className="d-flex align-items-end gap-2 flex-wrap">
                        <div className="display-6 fw-bold mb-0">
                          {result.saddle_height_in} in
                        </div>
                        <div className="rf-muted fw-semibold mb-2">
                          ({result.saddle_height_cm} cm)
                        </div>
                      </div>

                      <div className="rf-muted small mt-3">Recommended range</div>
                      <div className="fw-semibold">
                        {result.saddle_height_range_in[0]}–{result.saddle_height_range_in[1]} in{" "}
                        <span className="rf-muted fw-normal">
                          ({result.saddle_height_range_cm[0]}–{result.saddle_height_range_cm[1]} cm)
                        </span>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mt-4">
                        <div className="rf-muted small">Confidence</div>
                        <div className="rf-muted small">{confidencePct}%</div>
                      </div>
                      <div className="rf-progress mt-2">
                        <div style={{ width: `${confidencePct}%` }} />
                      </div>
                    </div>

                    {/* Guidance */}
                    <div className="rf-card p-4">
                      <div className="fw-bold mb-2">Guidance</div>
                      <div className="small">
                        <div className="mb-2">
                          <span className="fw-bold">Reach:</span>{" "}
                          <span className="rf-muted">{result.reach_guidance}</span>
                        </div>
                        <div className="mb-2">
                          <span className="fw-bold">Bar drop:</span>{" "}
                          <span className="rf-muted">{result.bar_drop_guidance}</span>
                        </div>
                        <div>
                          <span className="fw-bold">Geometry:</span>{" "}
                          <span className="rf-muted">{result.geometry_guidance}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pain guidance */}
                    {result.pain_analysis?.length > 0 && (
                      <div className="rf-card p-4">
                        <div className="fw-bold">Pain guidance</div>

                        {result.priority_adjustment && (
                          <div className="mt-2 small">
                            <span className="fw-bold">Priority:</span>{" "}
                            <span className="rf-muted">{result.priority_adjustment}</span>
                          </div>
                        )}

                        <div className="mt-3 d-flex flex-column gap-3">
                          {result.pain_analysis.map((p, idx) => (
                            <div key={idx} className="rf-card p-3">
                              <div className="fw-bold">{p.label}</div>
                              <ul className="mt-2 mb-2 small rf-muted">
                                {p.likely_causes.map((c, i) => (
                                  <li key={i}>{c}</li>
                                ))}
                              </ul>
                              <div className="small">
                                <span className="fw-bold">First adjustment:</span>{" "}
                                <span className="rf-muted">{p.first_adjustment}</span>
                              </div>
                              <div className="small mt-1">
                                <span className="fw-bold">Caution:</span>{" "}
                                <span className="rf-muted">{p.caution}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Next adjustment */}
                    <div className="rf-card p-4">
                      <div className="fw-bold">Next adjustment</div>
                      <div className="mt-2 small rf-muted">{result.next_adjustment}</div>
                      <div className="mt-3 small rf-muted">{result.disclaimer}</div>
                    </div>

                    {/* Notes */}
                    {result.notes?.length > 0 && (
                      <div className="rf-card p-4">
                        <div className="fw-bold">Notes</div>
                        <ul className="mt-2 mb-0 small rf-muted">
                          {result.notes.map((n, i) => (
                            <li key={i}>{n}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="rf-muted small mt-4">
                  This tool provides general guidance only and is not a substitute for a professional bike fit. 
                  Make small adjustments and test on short rides. Stop if you experience pain or discomfort.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="rf-muted small mt-4">
          AI Bike Fit Advisor • Prototype • Created by Shelby Joiner 
        </div>
      </div>
      <Analytics />
    </div>
  );
}
