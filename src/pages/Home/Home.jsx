import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/*
  index.html <head> ichiga qo'shing:
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@500;600&display=swap" rel="stylesheet" />
*/

const C = {
  bg:             "#0d9480",
  progressYellow: "#e2c229",
  progressDark:   "#0a7a6a",
  logo:           "#c9d83a",
  mutedTeal:      "#4dbfae",
  btnBorder:      "rgba(255,255,255,0.30)",
  btnBorderHov:   "rgba(255,255,255,0.55)",
  activeBg:       "#ffffff",
  activeText:     "#0d7a69",
  teamName:       "rgba(255,255,255,0.88)",
  divider:        "rgba(255,255,255,0.28)",
  startYellow:    "#f0c525",
  startYellowHov: "#f5d040",
  startText:      "#0a6659",
};

const F = {
  condensed: "'Barlow Condensed', sans-serif",
  regular:   "'Barlow', sans-serif",
};

const SUBJECTS = [
  ["MATHEMATICS", "ENGLISH",   "PHYSICS",   "HISTORY"],
  ["BIOLOGY",     "CHEMISTRY", "GEOGRAPHY", "ART"],
];

/* ── Subject Button ── */
function SubjectButton({ label, active, onSelect, delay }) {
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const handleClick = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 180);
    onSelect();
  };

  return (
    <button
      onClick={handleClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        fontFamily: F.regular,
        fontWeight: 600,
        fontSize: "clamp(11px, 1.1vw, 15px)",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color:           active ? C.activeText : "#ffffff",
        backgroundColor: active ? C.activeBg   : "transparent",
        border: `2px solid ${active ? "#ffffff" : C.btnBorder}`,
        borderRadius: 14,
        padding: "clamp(16px, 2vh, 24px) 12px",
        cursor: "pointer",
        width: "100%",
        transition: "background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease, opacity 0.4s ease, transform 0.4s ease",
        opacity:   visible ? 1 : 0,
        transform: pressed
          ? "scale(0.94)"
          : visible
          ? "scale(1) translateY(0)"
          : "scale(0.96) translateY(10px)",
        userSelect: "none",
      }}
    >
      {label}
    </button>
  );
}

/* ── Team Block ── */
function TeamBlock({ name, delay }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div style={{
      textAlign: "center",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
      transition: "opacity 0.5s ease, transform 0.5s ease",
    }}>
      <p style={{
        fontFamily: F.regular,
        fontWeight: 500,
        fontSize: "clamp(11px, 1vw, 13px)",
        letterSpacing: "0.44em",
        color: C.mutedTeal,
        textTransform: "uppercase",
        margin: "0 0 5px",
      }}>
        READY
      </p>
      <h2 style={{
        fontFamily: F.condensed,
        fontWeight: 800,
        fontSize: "clamp(32px, 4vw, 52px)",
        color: C.teamName,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        margin: 0,
        lineHeight: 1,
        userSelect: "none",
      }}>
        {name}
      </h2>
    </div>
  );
}

/* ── Main Page ── #####################################################################################################################*/ 
export default function QuizGame() {
  const [selected, setSelected]     = useState("MATHEMATICS");
  const [startHov, setStartHov]     = useState(false);
  const [startPress, setStartPress] = useState(false);

  const [titleVisible,   setTitleVisible]   = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [teamsVisible,   setTeamsVisible]   = useState(false);
  const [startVisible,   setStartVisible]   = useState(false);

  const navigate = useNavigate()

  useEffect(() => {
    const timers = [
      setTimeout(() => setTitleVisible(true),    100),
      setTimeout(() => setSubtitleVisible(true), 300),
      setTimeout(() => setTeamsVisible(true),    700),
      setTimeout(() => setStartVisible(true),    900),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      height: "100vh",
      width: "100%",
      overflow: "hidden",
      backgroundColor: C.bg,
      display: "flex",
      flexDirection: "column",
      fontFamily: F.regular,
    }}>

      {/* Progress Bar */}
      <div style={{ display: "flex", height: 6, flexShrink: 0 }}>
        <div style={{ width: "32%", backgroundColor: C.progressYellow }} />
        <div style={{ flex: 1,      backgroundColor: C.progressDark  }} />
      </div>

      {/* Logo */}
      <header style={{ padding: "clamp(14px, 2vh, 22px) clamp(20px, 3vw, 40px) 0", flexShrink: 0 }}>
        <span style={{
          fontFamily: F.condensed,
          fontWeight: 700,
          fontSize: "clamp(13px, 1.2vw, 16px)",
          letterSpacing: "0.28em",
          color: C.logo,
          textTransform: "uppercase",
          userSelect: "none",
        }}>
          Pratoozle
        </span>
      </header>

      {/* Main */}
      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 clamp(20px, 4vw, 48px) clamp(16px, 3vh, 40px)",
        textAlign: "center",
        gap: 0,
        minHeight: 0,
      }}>

        {/* Title */}
        <h1 style={{
          fontFamily: F.condensed,
          fontWeight: 800,
          fontSize: "clamp(72px, 13vw, 148px)",
          color: "#ffffff",
          lineHeight: 0.90,
          letterSpacing: "-0.01em",
          margin: 0,
          userSelect: "none",
          opacity: titleVisible ? 1 : 0,
          transform: titleVisible ? "translateY(0)" : "translateY(-24px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}>
          Pratoozle
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: F.regular,
          fontWeight: 500,
          fontSize: "clamp(12px, 1.1vw, 15px)",
          letterSpacing: "0.38em",
          color: C.mutedTeal,
          textTransform: "uppercase",
          margin: "clamp(12px, 1.8vh, 20px) 0 clamp(20px, 3.5vh, 44px)",
          opacity: subtitleVisible ? 1 : 0,
          transform: subtitleVisible ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}>
          CHOOSE A SUBJECT
        </p>

        {/* Subject Grid */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "clamp(10px, 1.4vh, 16px)",
          width: "100%",
          maxWidth: 900,
        }}>
          {SUBJECTS.map((row, ri) => (
            <div key={ri} style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "clamp(10px, 1.4vw, 16px)",
            }}>
              {row.map((subj, ci) => (
                <SubjectButton
                  key={subj}
                  label={subj}
                  active={selected === subj}
                  onSelect={() => setSelected(subj)}
                  delay={380 + (ri * 4 + ci) * 55}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Teams */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(28px, 5vw, 60px)",
          marginTop: "clamp(24px, 4vh, 58px)",
          opacity: teamsVisible ? 1 : 0,
          transform: teamsVisible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}>
          <TeamBlock name="TEAM 1" delay={720} />
          <div style={{
            width: 52,
            height: 2,
            backgroundColor: C.divider,
            borderRadius: 1,
            flexShrink: 0,
          }} />
          <TeamBlock name="TEAM 2" delay={780} />
        </div>

        {/* Start Button */}
        <button
          onMouseEnter={() => setStartHov(true)}
          onMouseLeave={() => { setStartHov(false); setStartPress(false); }}
          onMouseDown={() => setStartPress(true)}
          onMouseUp={() => setStartPress(false)}
          onClick={() => navigate("/game")}
          style={{
            marginTop: "clamp(24px, 4.5vh, 68px)",
            fontFamily: F.regular,
            fontWeight: 600,
            fontSize: "clamp(12px, 1.1vw, 15px)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: C.startText,
            backgroundColor: startHov ? C.startYellowHov : C.startYellow,
            border: "none",
            borderRadius: 16,
            padding: "clamp(18px, 2.2vh, 26px) 0",
            width: "min(340px, 88vw)",
            cursor: "pointer",
            transition: "background-color 0.15s ease, transform 0.12s ease, opacity 0.5s ease",
            transform: startPress
              ? "scale(0.96)"
              : startHov
              ? "translateY(-2px)"
              : "translateY(0)",
            opacity: startVisible ? 1 : 0,
            userSelect: "none",
          }}
        >
          START GAME
        </button>
      </main>

      {/* Responsive */}
      <style>{`
        @media (max-width: 640px) {
          .qg-subject-row {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}