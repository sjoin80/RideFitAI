import { useState } from "react";

export default function App() {
  const [form, setForm] = useState({
    height_in: 74,
    inseam_in: 35,
    riding_style: "endurance",
    flexibility: "medium",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name.includes("_in") ? Number(value) : value,
    }));
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

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1>AI Bike Fit Advisor</h1>
      <p>Enter your measurements to get a starting fit estimate.</p>

      <form onSubmit={submit} style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
        <label>
          Height (in)
          <input name="height_in" type="number" step="0.1" value={form.height_in} onChange={onChange} />
        </label>

        <label>
          Inseam (in)
          <input name="inseam_in" type="number" step="0.1" value={form.inseam_in} onChange={onChange} />
        </label>

        <label>
          Riding style
          <select name="riding_style" value={form.riding_style} onChange={onChange}>
            <option value="endurance">endurance</option>
            <option value="race">race</option>
            <option value="gravel">gravel</option>
            <option value="commute">commute</option>
          </select>
        </label>

        <label>
          Flexibility
          <select name="flexibility" value={form.flexibility} onChange={onChange}>
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
        </label>

        <button type="submit" disabled={loading} style={{ gridColumn: "1 / -1", padding: 12, cursor: "pointer" }}>
          {loading ? "Calculating..." : "Get Fit Estimate"}
        </button>
      </form>

      {error && (
        <pre style={{ marginTop: 16, padding: 12, background: "#fee", borderRadius: 8, whiteSpace: "pre-wrap" }}>
          {error}
        </pre>
      )}

      {result && (
        <div style={{ marginTop: 16, padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
          <h2>Results</h2>

          <p>
            <strong>Saddle height:</strong> {result.saddle_height_in} in ({result.saddle_height_cm} cm)
          </p>

          <p>
            <strong>Recommended range:</strong>{" "}
            {result.saddle_height_range_in[0]}–{result.saddle_height_range_in[1]} in{" "}
            ({result.saddle_height_range_cm[0]}–{result.saddle_height_range_cm[1]} cm)
          </p>

          <p><strong>Confidence:</strong> {result.confidence}</p>
          <p><strong>Reach:</strong> {result.reach_guidance}</p>
          <p><strong>Bar drop:</strong> {result.bar_drop_guidance}</p>
          <p><strong>Geometry:</strong> {result.geometry_guidance}</p>

          {result.notes?.length > 0 && (
            <>
              <h3>Notes</h3>
              <ul>
                {result.notes.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
            </>
          )}

          <p><strong>Next adjustment:</strong> {result.next_adjustment}</p>
          <p style={{ opacity: 0.75 }}>{result.disclaimer}</p>
        </div>
      )}
    </div>
  );
}
