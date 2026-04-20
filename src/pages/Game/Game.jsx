import { useState } from "react";
import { Pause, Settings, Check } from "lucide-react";

/*
  index.html <head>:
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet" />
*/

const TEAM_COLORS = {
  1: {
    dot:         "#dc2626",
    pillBg:      "#fef2f2",
    pillBorder:  "#fca5a5",
    pillText:    "#b91c1c",
    activePillBg:"#fee2e2",
    activeBorder:"#f87171",
    activeText:  "#991b1b",
    scoreDark:   "#b91c1c",
    topBar:      "#dc2626",
    teamBg:      "rgba(220,38,38,0.04)",
    hintColor:   "#dc2626",
  },
  2: {
    dot:         "#2563eb",
    pillBg:      "#eff6ff",
    pillBorder:  "#93c5fd",
    pillText:    "#1d4ed8",
    activePillBg:"#dbeafe",
    activeBorder:"#60a5fa",
    activeText:  "#1e40af",
    scoreDark:   "#1d4ed8",
    topBar:      "#2563eb",
    teamBg:      "rgba(37,99,235,0.04)",
    hintColor:   "#2563eb",
  },
};

const C = {
  teal:       "#0d9480",
  tealLight:  "#e8f5f2",
  tealBorder: "#3dbfae",
  yellow:     "#f0c525",
  logo:       "#c9d83a",
  bg:         "#f0f0ee",
  white:      "#ffffff",
  scoreNeutral:"#0d7a69",
  tileBorder: "#b8ddd8",
  divider:    "#e0e8e6",
  mutedText:  "#9aa5a3",
};

const F = {
  condensed: "'Barlow Condensed', sans-serif",
  regular:   "'Barlow', sans-serif",
};

const INITIAL_TILES = Array.from({ length: 20 }, (_, i) => {
  const n = i + 1;
  if (n === 3)  return { id: n, state: "correct" };
  if (n === 7)  return { id: n, state: "bomb"    };
  if (n === 14) return { id: n, state: "gift"    };
  if (n === 17) return { id: n, state: "correct" };
  return { id: n, state: "default" };
});

// ── Team Score Block ─────────────────────────────────────
function TeamBlock({ teamNum, score, isActive }) {
  const tc = TEAM_COLORS[teamNum];
  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "12px 0 14px",
      gap: 4,
      position: "relative",
      background: isActive ? tc.teamBg : "transparent",
      transition: "background 0.3s ease",
    }}>
      {/* Active top bar */}
      <div style={{
        position: "absolute",
        top: 0, left: "20%", right: "20%",
        height: 3,
        borderRadius: "0 0 4px 4px",
        background: tc.topBar,
        opacity: isActive ? 1 : 0,
        transition: "opacity 0.3s ease",
      }} />

      {/* Team pill label */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        fontFamily: F.condensed,
        fontWeight: 700,
        fontSize: "clamp(13px, 1.4vw, 17px)",
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        padding: "3px 14px 3px 10px",
        borderRadius: 100,
        color: isActive ? tc.activeText : tc.pillText,
        background: isActive ? tc.activePillBg : tc.pillBg,
        border: `1.5px solid ${isActive ? tc.activeBorder : tc.pillBorder}`,
        transition: "all 0.3s ease",
        userSelect: "none",
      }}>
        <span style={{
          width: 8, height: 8,
          borderRadius: "50%",
          background: tc.dot,
          flexShrink: 0,
          transform: isActive ? "scale(1.25)" : "scale(1)",
          transition: "transform 0.3s ease",
        }} />
        TEAM {teamNum}
      </div>

      {/* Score */}
      <div style={{
        fontFamily: F.condensed,
        fontWeight: 800,
        fontSize: "clamp(30px, 3.8vw, 44px)",
        lineHeight: 1,
        color: isActive ? tc.scoreDark : C.scoreNeutral,
        transition: "color 0.3s ease",
        userSelect: "none",
      }}>
        {score}
      </div>

      {/* "YOUR TURN" hint */}
      <div style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: tc.hintColor,
        opacity: isActive ? 1 : 0,
        transition: "opacity 0.3s ease",
        height: 14,
      }}>
        YOUR TURN
      </div>
    </div>
  );
}

// ── Tile ────────────────────────────────────────────────
function Tile({ tile, index, onClick }) {
  const [hov, setHov] = useState(false);
  const [pressed, setPressed] = useState(false);

  const isDefault = tile.state === "default";
  const isCorrect = tile.state === "correct";
  const isBomb    = tile.state === "bomb";
  const isGift    = tile.state === "gift";

  const bg = isCorrect ? C.teal
           : (isBomb || isGift) ? C.yellow
           : hov ? "#e8f5f2"
           : C.white;

  const border = isCorrect ? C.teal
               : (isBomb || isGift) ? C.yellow
               : hov ? C.tealBorder
               : C.tileBorder;

  return (
    <div
      onClick={() => {
        if (!isDefault) return;
        setPressed(true);
        setTimeout(() => setPressed(false), 150);
        onClick(tile.id);
      }}
      onMouseEnter={() => isDefault && setHov(true)}
      onMouseLeave={() => { setHov(false); setPressed(false); }}
      onMouseDown={() => isDefault && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        background: bg,
        border: `2px solid ${border}`,
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: isDefault ? "pointer" : "default",
        aspectRatio: "1 / 1",
        transition: "background 0.2s ease, border-color 0.2s ease, transform 0.13s ease, box-shadow 0.18s ease",
        transform: pressed ? "scale(0.90)" : hov && isDefault ? "scale(1.05)" : "scale(1)",
        boxShadow: hov && isDefault ? "0 4px 16px rgba(13,148,128,0.14)" : "none",
        animation: `tileIn 0.4s ease ${index * 0.038}s both`,
      }}
    >
      {isCorrect && <Check size={26} strokeWidth={3} color="#ffffff" />}
      {isBomb    && <span style={{ fontSize: "clamp(22px,2.8vw,32px)", lineHeight: 1, userSelect: "none" }}>💣</span>}
      {isGift    && <span style={{ fontSize: "clamp(22px,2.8vw,32px)", lineHeight: 1, userSelect: "none" }}>🎁</span>}
      {isDefault && (
        <span style={{
          fontFamily: F.condensed,
          fontWeight: 700,
          fontSize: "clamp(20px, 2.6vw, 34px)",
          color: C.scoreNeutral,
          userSelect: "none",
          lineHeight: 1,
        }}>
          {tile.id}
        </span>
      )}
    </div>
  );
}

// ── Main ────────────────────────────────────────────────###########################################################################
export default function GameBoard() {
  const [tiles, setTiles] = useState(INITIAL_TILES);
  const [currentTeam, setCurrentTeam] = useState(1);
  const [scores, setScores] = useState({ 1: 120, 2: 80 });

  const handleTileClick = (id) => {
    const roll = Math.random();
    const newState = roll < 0.15 ? "bomb" : roll < 0.28 ? "gift" : "correct";
    setTiles(prev => prev.map(t => t.id === id ? { ...t, state: newState } : t));
    if (newState === "correct") {
      setScores(p => ({ ...p, [currentTeam]: p[currentTeam] + 10 }));
      setCurrentTeam(t => t === 1 ? 2 : 1);
    } else if (newState === "bomb") {
      setScores(p => ({ ...p, [currentTeam]: Math.max(0, p[currentTeam] - 20) }));
      setCurrentTeam(t => t === 1 ? 2 : 1);
    } else {
      setScores(p => ({ ...p, [currentTeam]: p[currentTeam] + 20 }));
    }
  };

  return (
    <div style={{
      height: "100%", width: "100%", overflow: "hidden",
      display: "flex", flexDirection: "column",
      fontFamily: F.regular, background: C.bg,
    }}>
      {/* Header */}
      <header style={{
        background: C.teal,
        height: "clamp(50px,6vh,62px)",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px", flexShrink: 0,
      }}>
        <span style={{
          fontFamily: F.condensed, fontWeight: 700,
          fontSize: "clamp(13px,1.5vw,18px)",
          letterSpacing: "0.18em", color: C.logo,
          textTransform: "uppercase", userSelect: "none",
        }}>
          THE KINETIC GALLERY
        </span>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          {[<Pause size={20} strokeWidth={2} />, <Settings size={20} strokeWidth={2} />].map((icon, i) => (
            <button key={i} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "white", display: "flex", alignItems: "center",
              padding: 4, borderRadius: 6, opacity: 0.9,
            }}>
              {icon}
            </button>
          ))}
        </div>
      </header>

      {/* Score Bar */}
      <div style={{
        background: C.white,
        borderBottom: `1.5px solid ${C.tealLight}`,
        display: "flex", alignItems: "stretch",
        flexShrink: 0,
      }}>
        <TeamBlock teamNum={1} score={scores[1]} isActive={currentTeam === 1} />
        <div style={{ width: 1, background: C.divider, flexShrink: 0 }} />
        <TeamBlock teamNum={2} score={scores[2]} isActive={currentTeam === 2} />
      </div>

      {/* Game Area */}
      <main style={{
        flex: 1, minHeight: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "clamp(10px,2vh,20px) clamp(14px,3vw,32px)",
        gap: "clamp(12px,2vh,20px)",
      }}>
        {/* Turn Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 9,
          border: `1.5px solid ${C.teal}`,
          borderRadius: 100, padding: "8px 22px",
          background: C.white, flexShrink: 0,
          animation: "fadeDown 0.4s ease both",
        }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: C.yellow, flexShrink: 0 }} />
          <span style={{
            fontWeight: 600, fontSize: "clamp(11px,1vw,13px)",
            letterSpacing: "0.12em", color: C.teal,
            textTransform: "uppercase", whiteSpace: "nowrap",
          }}>
            TEAM {currentTeam}'S TURN — PICK A TILE
          </span>
        </div>

        {/* Tile Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "clamp(7px,1.1vw,13px)",
          width: "100%", maxWidth: 700,
        }}>
          {tiles.map((tile, i) => (
            <Tile key={tile.id} tile={tile} index={i} onClick={handleTileClick} />
          ))}
        </div>
      </main>

      <style>{`
        @keyframes tileIn {
          from { opacity:0; transform:scale(0.86) translateY(8px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes fadeDown {
          from { opacity:0; transform:translateY(-12px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
}