import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useParams, useNavigate } from "react-router-dom";
import { shouldShowQuestion } from "../utils/conditionalClient";

export default function FormViewer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get(`/forms/${id}`)
      .then((res) => setForm(res.data))
      .catch((err) => {
        console.error("Failed to fetch form:", err);
        setForm(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container" style={{ textAlign: "center" }}>Loading Form...</div>;
  if (!form) return <div className="container" style={{ textAlign: "center", color: "#fa5252" }}>Form not found.</div>;
  const isVisible = (q) => {
    try { return shouldShowQuestion(q.conditionalRules, answers); } 
    catch { return true; }
  };

  const updateAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`/responses/${id}/submit`, { answers });
      alert("Form submitted successfully!");
      navigate(`/forms/${id}/responses`);
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Submission failed.");
    }
  };

  return (
    <div className="container">
      <h2 style={{ color: "#4a4e69", borderBottom: "2px solid #e9ecef", paddingBottom: 10 }}>
        {form.title}
      </h2>

      {form.questions.map((q) => isVisible(q) && (
        <div key={q.questionKey} className="card">
          <label>
            {q.label}{" "}
            {q.required && <span style={{ color: "#fa5252", fontWeight: "normal" }}>*</span>}
          </label>
          {q.type === "singleLineText" && (
            <input
              type="text"
              className="input"
              value={answers[q.questionKey] || ""}
              onChange={(e) => updateAnswer(q.questionKey, e.target.value)}
            />
          )}
          {(q.type === "longText" || q.type === "multilineText") && (
            <textarea
              rows="4"
              className="input"
              value={answers[q.questionKey] || ""}
              onChange={(e) => updateAnswer(q.questionKey, e.target.value)}
            />
          )}
          {q.type === "singleSelect" && (
            <select
              className="input"
              value={answers[q.questionKey] || ""}
              onChange={(e) => updateAnswer(q.questionKey, e.target.value)}
            >
              <option value="">-- Select an option --</option>
              {(q.options || []).map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}
          {q.type === "multipleSelects" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "10px 0" }}>
              {(q.options || []).map((opt) => {
                const selected = answers[q.questionKey] || [];
                return (
                  <label key={opt} style={{ fontWeight: "normal", display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="checkbox"
                      checked={selected.includes(opt)}
                      onChange={(e) => {
                        const newSet = new Set(selected);
                        if (e.target.checked) newSet.add(opt);
                        else newSet.delete(opt);
                        updateAnswer(q.questionKey, [...newSet]);
                      }}
                    />
                    {opt}
                  </label>
                );
              })}
            </div>
          )}
        </div>
      ))}

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <button className="btn btn-primary" onClick={handleSubmit}>Submit Response</button>
      </div>
    </div>
  );
}