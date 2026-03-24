import { useState } from "react";

export default function EberronCalendar() {
  const months = [
    "Zarantyr","Olarune","Therendor","Eyre","Dravago","Nymm",
    "Lharvion","Barrakas","Rhaan","Sypheros","Aryth","Vult",
  ];

  const daysPerMonth = 28;

  const [campaignMonth, setCampaignMonth] = useState(0);
  const [campaignDay, setCampaignDay] = useState(1);

  const [notes, setNotes] = useState({});
  const [saveStatus, setSaveStatus] = useState("");

  const getKey = (m, d) => `${months[m]}-${d}`;
  const currentKey = getKey(campaignMonth, campaignDay);
  const currentNote = notes[currentKey] || "";

  function updateNote(value) {
    setSaveStatus("Ink stabilising...");

    setNotes(prev => ({
      ...prev,
      [currentKey]: value
    }));

    setTimeout(() => setSaveStatus("Scribed into record ✓"), 350);
  }

  function insertTemplate(type) {
    const templates = {
      rumour: "\n[RUMOUR]\n- ",
      npc: "\n[NPC]\nName:\nRole:\nNotes:\n",
      combat: "\n[COMBAT]\nEnemies:\nLocation:\nTwist:\n",
      lore: "\n[LORE]\n- "
    };

    updateNote(currentNote + (templates[type] || ""));
  }

  const holidays = {
    "Olarune-9": { name: "Crystalfall", desc: "Remembrance of Sharn collapse" },
    "Olarune-20": { name: "Day of Mourning", desc: "Cyre destroyed in the Mourning" },
    "Sypheros-18": { name: "Wildnight", desc: "Reality destabilises under the Fury" }
  };

  const holiday = holidays[currentKey];

  // 🕯️ SIVIS FIELD ARCHIVE VISUAL LAYER

  const parchment = {
    background: "radial-gradient(circle at top, #f3e2bc, #d2bc8f)",
    minHeight: "100vh",
    padding: 18,
    fontFamily: "'Garamond', serif",
    color: "#2a1f12",
    backgroundImage:
      "repeating-linear-gradient(0deg, rgba(0,0,0,0.02), rgba(0,0,0,0.02) 1px, transparent 2px)",
    boxShadow: "inset 0 0 120px rgba(0,0,0,0.25)"
  };

  const panel = {
    background: "rgba(255, 250, 235, 0.7)",
    border: "1px solid rgba(60,40,20,0.35)",
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
    boxShadow: "inset 0 0 14px rgba(0,0,0,0.06)"
  };

  const buttonStyle = {
    background: "rgba(45, 30, 18, 0.95)",
    color: "#f4e7c9",
    border: "1px solid rgba(0,0,0,0.4)",
    padding: "6px 10px",
    borderRadius: 6,
    cursor: "pointer",
    fontFamily: "Garamond, serif"
  };

  const selectedStyle = {
    padding: 8,
    border: "2px solid #3a2a1a",
    background: "radial-gradient(circle, rgba(170,130,80,0.6), rgba(90,70,40,0.25))",
    cursor: "pointer",
    boxShadow: "inset 0 0 14px rgba(0,0,0,0.45)",
    transform: "scale(1.03)"
  };

  const normalStyle = {
    padding: 8,
    border: "1px solid rgba(80,60,40,0.25)",
    background: "rgba(255, 244, 220, 0.45)",
    cursor: "pointer"
  };

  return (
    <div style={parchment}>
      <style>
        {`
          .sivisGlow {
            animation: inkPulse 6s ease-in-out infinite;
          }

          @keyframes inkPulse {
            0% { filter: brightness(1); }
            50% { filter: brightness(1.03); }
            100% { filter: brightness(1); }
          }

          .tornEdge {
            position: relative;
          }

          .tornEdge:before {
            content: "";
            position: absolute;
            inset: 0;
            border: 1px solid rgba(0,0,0,0.08);
            pointer-events: none;
          }
        `}
      </style>

      <h1 className="sivisGlow">📜 SIVIS FIELD ARCHIVE</h1>

      <div style={panel}>
        <h3>📅 Campaign Time</h3>

        <div style={{ display: "flex", gap: 10 }}>
          <select style={buttonStyle} value={campaignMonth} onChange={(e) => setCampaignMonth(Number(e.target.value))}>
            {months.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>

          <select style={buttonStyle} value={campaignDay} onChange={(e) => setCampaignDay(Number(e.target.value))}>
            {Array.from({ length: daysPerMonth }, (_, i) => i + 1).map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <p>Recorded Date: <b>{months[campaignMonth]} {campaignDay}</b></p>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button style={buttonStyle} onClick={() => setCampaignMonth(m => (m - 1 + 12) % 12)}>◀</button>
        <h2 className="sivisGlow">{months[campaignMonth]}</h2>
        <button style={buttonStyle} onClick={() => setCampaignMonth(m => (m + 1) % 12)}>▶</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
        {Array.from({ length: daysPerMonth }, (_, i) => i + 1).map(day => {
          const isSelected = campaignDay === day;

          return (
            <div
              key={day}
              onClick={() => setCampaignDay(day)}
              style={isSelected ? selectedStyle : normalStyle}
              className="tornEdge"
            >
              {day}
            </div>
          );
        })}
      </div>

      <div style={panel}>
        <h2 className="sivisGlow">{holiday?.name || "Ordinary Entry"}</h2>
        {holiday && <p>{holiday.desc}</p>}
      </div>

      <div style={panel}>
        <h3>📝 Field Record</h3>

        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <button style={buttonStyle} onClick={() => insertTemplate("rumour")}>Rumour</button>
          <button style={buttonStyle} onClick={() => insertTemplate("npc")}>NPC</button>
          <button style={buttonStyle} onClick={() => insertTemplate("combat")}>Combat</button>
          <button style={buttonStyle} onClick={() => insertTemplate("lore")}>Lore</button>
        </div>

        <textarea
          value={currentNote}
          onChange={(e) => updateNote(e.target.value)}
          style={{
            width: "100%",
            height: 140,
            fontFamily: "Garamond, serif",
            background: "rgba(255,250,235,0.7)",
            border: "1px solid rgba(60,40,20,0.3)"
          }}
        />

        <small>{saveStatus}</small>
      </div>
    </div>
  );
}