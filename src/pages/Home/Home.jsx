import { useState, useEffect } from "react";
import useGameStore from "../../store/useGameStore";

const SUBJECTS = [
  "ENGLISH",
  "GEOGRAPHY",
];

const TEAM_COLORS = {
  1: { dot: "#dc2626", pill: "#fef2f2", pillBorder: "#fca5a5", pillText: "#b91c1c" },
  2: { dot: "#2563eb", pill: "#eff6ff", pillBorder: "#93c5fd", pillText: "#1d4ed8" },
};

/* ── Subject Button ─────────────────────────────────────── */
function SubjectBtn({ label, active, onClick, delay }) {
  const [hov,  setHov]  = useState(false);
  const [pres, setPres] = useState(false);
  const [vis,  setVis]  = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => !active && setHov(true)}
      onMouseLeave={() => { setHov(false); setPres(false); }}
      onMouseDown={() => setPres(true)}
      onMouseUp={() => setPres(false)}
      style={{
        fontFamily: "var(--f-regular)",
        fontWeight: 600,
        fontSize: "clamp(11px, 1.05vw, 14px)",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color:           active ? "var(--teal-dark)" : "#fff",
        backgroundColor: active ? "#fff" : hov ? "rgba(255,255,255,0.1)" : "transparent",
        border: `2px solid ${active ? "#fff" : hov ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.3)"}`,
        borderRadius: 14,
        padding: "clamp(15px, 2vh, 22px) 12px",
        cursor: "pointer",
        width: "100%",
        transition: "background 0.18s, border-color 0.18s, color 0.18s, transform 0.12s",
        transform: pres ? "scale(0.93)" : vis ? "scale(1) translateY(0)" : "scale(0.95) translateY(12px)",
        opacity: vis ? 1 : 0,
        // transition already covers transform + opacity via the transition property
      }}
    >
      {label}
    </button>
  );
}

/* ── Landing Page ───────────────────────────────────────── */
export default function LandingPage() {
  const startGame  = useGameStore((s) => s.startGame);
  const [selected, setSelected] = useState("ENGLISH");
  const [startHov, setStartHov] = useState(false);
  const [startPres, setStartPres] = useState(false);
  
  // Staggered visibility triggers
  const [t, setT] = useState({
    logo: false, title: false, sub: false,
    teams: false, start: false,
  });

  useEffect(() => {
    const timers = [
      setTimeout(() => setT((p) => ({ ...p, logo:  true })),  80),
      setTimeout(() => setT((p) => ({ ...p, title: true })),  180),
      setTimeout(() => setT((p) => ({ ...p, sub:   true })),  320),
      setTimeout(() => setT((p) => ({ ...p, teams: true })),  700),
      setTimeout(() => setT((p) => ({ ...p, start: true })),  860),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      height: "100vh", width: "100%", overflow: "hidden",
      backgroundColor: "#0d9480",
      display: "flex", flexDirection: "column",
      fontFamily: "var(--f-regular)",
    }}>
      {/* Progress bar */}
      <div style={{ display: "flex", height: 6, flexShrink: 0 }}>
        <div style={{ width: "32%", background: "var(--yellow)" }} />
        <div style={{ flex: 1,      background: "var(--teal-dark)" }} />
      </div>

      {/* Logo */}
      <header style={{ padding: "clamp(14px,2vh,22px) clamp(20px,3vw,40px) 0", flexShrink: 0 }}>
        <span style={{
          fontFamily: "var(--f-condensed)", fontWeight: 700,
          fontSize: "clamp(13px, 1.2vw, 16px)",
          letterSpacing: "0.28em", color: "var(--logo)",
          textTransform: "uppercase", userSelect: "none",
          display: "inline-block",
          opacity:   t.logo ? 1 : 0,
          transform: t.logo ? "translateY(0)" : "translateY(-12px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}>
          KINETIC GALLERY
        </span>
      </header>

      {/* Main */}
      <main style={{
        flex: 1, minHeight: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 clamp(20px,4vw,48px) clamp(16px,3vh,36px)",
        textAlign: "center",
      }}>
        {/* Title */}
        <h1 style={{
          fontFamily: "var(--f-condensed)", fontWeight: 800,
          fontSize: "clamp(72px, 13vw, 148px)",
          color: "#fff", lineHeight: 0.9,
          letterSpacing: "-0.01em", margin: 0, userSelect: "none",
          opacity:   t.title ? 1 : 0,
          transform: t.title ? "translateY(0)" : "translateY(-24px)",
          transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(.34,1.2,.64,1)",
        }}>
          QUIZ GAME
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: "var(--f-regular)", fontWeight: 500,
          fontSize: "clamp(12px, 1.1vw, 15px)",
          letterSpacing: "0.38em", color: "#4dbfae",
          textTransform: "uppercase",
          margin: "clamp(12px,1.8vh,20px) 0 clamp(20px,3.5vh,44px)",
          opacity:   t.sub ? 1 : 0,
          transform: t.sub ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}>
          CHOOSE A SUBJECT
        </p>

        {/* Subject Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(200px, 320px))",
          gap: "clamp(12px,1.8vw,20px)",
          justifyContent: "center",
          width: "100%",
          maxWidth: 720,
        }}>
          {SUBJECTS.map((subj, ci) => (
            <SubjectBtn
              key={subj}
              label={subj}
              active={selected === subj}
              onClick={() => setSelected(subj)}
              delay={380 + ci * 90}
            />
          ))}
        </div>

        {/* Teams */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "clamp(28px,5vw,60px)", marginTop: "clamp(22px,4vh,56px)",
          opacity:   t.teams ? 1 : 0,
          transform: t.teams ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}>
          {[1, 2].map((n, i) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: i === 0 ? "clamp(28px,5vw,60px)" : 0 }}>
              {i === 0 && <TeamBlock n={1} />}
              {i === 0 && (
                <div style={{
                  width: 52, height: 2,
                  background: "rgba(255,255,255,0.28)",
                  flexShrink: 0,
                }} />
              )}
              {i === 1 && <TeamBlock n={2} />}
            </div>
          ))}
        </div>

        {/* Start Game Button */}
        <button
          onMouseEnter={() => setStartHov(true)}
          onMouseLeave={() => { setStartHov(false); setStartPres(false); }}
          onMouseDown={() => setStartPres(true)}
          onMouseUp={() => setStartPres(false)}
          onClick={() => startGame(selected.toLowerCase())}
          style={{
            marginTop: "clamp(22px,4.5vh,64px)",
            fontFamily: "var(--f-regular)", fontWeight: 600,
            fontSize: "clamp(12px, 1.1vw, 15px)",
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: "var(--yellow-text)",
            backgroundColor: startHov ? "var(--yellow-hover)" : "var(--yellow)",
            border: "none", borderRadius: 16,
            padding: "clamp(18px,2.2vh,24px) 0",
            width: "min(340px, 88vw)",
            cursor: "pointer",
            transition: "background 0.15s, transform 0.12s, opacity 0.5s",
            transform: startPres ? "scale(0.95)" : startHov ? "translateY(-2px)" : "translateY(0)",
            opacity: t.start ? 1 : 0,
            userSelect: "none",
          }}
        >
          START GAME
        </button>
      </main>
    </div>
  );
}

function TeamBlock({ n }) {
  const tc = TEAM_COLORS[n];
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        fontFamily: "var(--f-condensed)", fontWeight: 700,
        fontSize: "clamp(12px,1.2vw,15px)", letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: tc.pillText, background: tc.pill,
        border: `1.5px solid ${tc.pillBorder}`,
        borderRadius: 100, padding: "3px 14px 3px 10px",
        marginBottom: 6, userSelect: "none",
      }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: tc.dot, flexShrink: 0 }} />
        TEAM {n}
      </div>
      <div style={{
        fontFamily: "var(--f-condensed)", fontWeight: 800,
        fontSize: "clamp(30px,4vw,50px)",
        color: "rgba(255,255,255,0.85)",
        letterSpacing: "0.06em", textTransform: "uppercase",
        lineHeight: 1, userSelect: "none",
      }}>
        READY
      </div>
    </div>
  );
}