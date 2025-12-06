import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
export default function FormBuilder() {
  const [forms, setForms] = useState([]);
  const [bases, setBases] = useState([]);
  const [tables, setTables] = useState([]);
  const [fields, setFields] = useState([]);
  const [selectedBase, setSelectedBase] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const SUPPORTED_TYPES = ["singleLineText", "longText", "singleSelect", "multipleSelects", "attachment"];
  
  useEffect(() => {
    axios.get('/forms').then(r => setForms(r.data)).catch(() => {});
    axios.get('/forms/airtable/bases')
      .then(r => setBases(r.data.bases || r.data))
      .catch((err) => console.error("Failed to load bases", err));
  }, []);
  const loadTables = async (baseId) => {
    setFields([]);
    setSelectedTable('');
    if (!baseId) return;

    try {
      const res = await axios.get(`/forms/airtable/bases/${baseId}/tables`);
      setTables(res.data.tables || res.data);
    } catch {
      alert("Failed to fetch tables.");
    }
  };

  const loadFields = async () => {
    if (!selectedBase || !selectedTable) {
      return alert("Select a base and a table.");
    }

    try {
      const res = await axios.get(`/forms/airtable/bases/${selectedBase}/tables/${selectedTable}/fields`);
      const validFields = res.data.filter(f => SUPPORTED_TYPES.includes(f.type));
      setFields(validFields);
    } catch (e) {
      console.error(e);
      alert("Failed to fetch fields. Check your base/table.");
    }
  };

  const addQ = (f) => {
    if (questions.find(q => q.airtableFieldId === f.id)) {
      return alert("This field is already added.");
    }
    let cleanOptions = [];
    if (f.options && f.options.choices) {
      cleanOptions = f.options.choices.map(c => c.name);
    } else if (Array.isArray(f.options)) {
      cleanOptions = f.options;
    }

    setQuestions(qs => [
      ...qs,
      {
        questionKey: "q_" + f.id,
        airtableFieldId: f.id,
        label: f.name,
        type: f.type,
        required: false,
        options: cleanOptions,
        conditionalRules: null,
      }
    ]);
  };
  const removeQ = (key) =>
    setQuestions(qs => qs.filter(q => q.questionKey !== key));
  const save = async () => {
    if (!title.trim()) return alert("Enter a form title.");
    if (!selectedBase || !selectedTable) return alert("Base and Table required.");
    if (questions.length === 0) return alert("Add at least one question.");

    try {
      const res = await axios.post("/forms", {
        title,
        airtableBaseId: selectedBase,
        airtableTableId: selectedTable,
        questions
      });

      alert("Form created!");
      navigate(`/form/${res.data._id}`);

    } catch (e) {
      console.error(e);
      alert("Failed to save form. Check console for details.");
    }
  };

  return (
    <div className="container">
      <h2 style={{ color: "#4a4e69" }}>Form Creator</h2>
      <div className="card">
        <label>Form Title</label>
        <input
          type="text"
          placeholder="e.g., Client Onboarding Survey"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="card">
        <h4>1. Select Airtable Base & Table</h4>

        <div className="flex-group">
          <select
            className="input"
            style={{ flex: 1 }}
            value={selectedBase}
            onChange={(e) => {
              setSelectedBase(e.target.value);
              loadTables(e.target.value);
            }}
          >
            <option value="">-- Select Base --</option>
            {(bases || []).map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <select
            className="input"
            style={{ flex: 1 }}
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
          >
            <option value="">-- Select Table --</option>
            {tables.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <button className="btn btn-secondary" onClick={loadFields}>
            Fetch Fields
          </button>
        </div>
      </div>
      {fields.length > 0 && (
        <div className="card">
          <h4>2. Available Airtable Fields</h4>

          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {fields.map((f) => (
              <div key={f.id} className="field-item">
                <span>
                  {f.name}{" "}
                  <code style={{ color: "#868e96", fontSize: "0.8rem" }}>
                    ({f.type})
                  </code>
                </span>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => addQ(f)}
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {questions.length > 0 && (
        <div className="card">
          <h4>3. Form Questions ({questions.length})</h4>

          {questions.map((q) => (
            <div
              key={q.questionKey}
              className="field-item"
              style={{
                border: "1px solid #dee2e6",
                borderRadius: 4,
                marginBottom: 8,
                padding: 10,
                backgroundColor: "#f8f9fa"
              }}
            >
              <strong>{q.label}</strong>
              <span style={{ color: "#4a4e69" }}>{q.type}</span>

              <button
                className="btn btn-sm"
                style={{ backgroundColor: "#fa5252", color: "white" }}
                onClick={() => removeQ(q.questionKey)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
      <div style={{ textAlign: "right", marginTop: "1.5rem" }}>
        <button className="btn btn-primary" onClick={save}>
          Save Form
        </button>
      </div>
    </div>
  );
}