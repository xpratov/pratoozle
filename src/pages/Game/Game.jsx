import { useState, useEffect, useRef } from "react";
import { Pause, Settings, Check, X } from "lucide-react";
import useGameStore from "../../store/useGameStore";

const TEAM_COLORS = {
  1: {
    dot: "#dc2626", topBar: "#dc2626", teamBg: "rgba(220,38,38,0.04)",
    pillBg: "#fef2f2", pillBorder: "#fca5a5", pillText: "#b91c1c",
    activePillBg: "#fee2e2", activeBorder: "#f87171", activeText: "#991b1b",
    scoreActive: "#b91c1c", hint: "#dc2626",
  },
  2: {
    dot: "#2563eb", topBar: "#2563eb", teamBg: "rgba(37,99,235,0.04)",
    pillBg: "#eff6ff", pillBorder: "#93c5fd", pillText: "#1d4ed8",
    activePillBg: "#dbeafe", activeBorder: "#60a5fa", activeText: "#1e40af",
    scoreActive: "#1d4ed8", hint: "#2563eb",
  },
};

/* ── Animated Score ─────────────────────────────────────── */
function AnimatedScore({ value, active, teamNum }) {
  const tc = TEAM_COLORS[teamNum];
  const [display, setDisplay] = useState(value);
  const [bump, setBump] = useState(false);
  const prev = useRef(value);

  useEffect(() => {
    if (value !== prev.current) {
      setBump(true);
      const start = prev.current;
      const end   = value;
      const diff  = end - start;
      const steps = 20;
      let i = 0;
      const id = setInterval(() => {
        i++;
        setDisplay(Math.round(start + (diff * i) / steps));
        if (i >= steps) { clearInterval(id); prev.current = end; }
      }, 18);
      setTimeout(() => setBump(false), 500);
    }
  }, [value]);

  return (
    <span style={{
      fontFamily: "var(--f-condensed)", fontWeight: 800,
      fontSize: "clamp(28px, 3.8vw, 44px)", lineHeight: 1,
      color: active ? tc.scoreActive : "var(--score-neutral)",
      transition: "color 0.3s",
      display: "inline-block",
      animation: bump ? "scoreBump 0.45s cubic-bezier(.34,1.56,.64,1)" : "none",
    }}>
      {display}
    </span>
  );
}

/* ── Team Score Block ───────────────────────────────────── */
function TeamScoreBlock({ teamNum, score, isActive }) {
  const tc = TEAM_COLORS[teamNum];
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "10px 0 12px", gap: 4, position: "relative",
      background: isActive ? tc.teamBg : "transparent",
      transition: "background 0.3s",
    }}>
      {/* Top bar */}
      <div style={{
        position: "absolute", top: 0, left: "20%", right: "20%",
        height: 3, borderRadius: "0 0 4px 4px",
        background: tc.topBar,
        opacity: isActive ? 1 : 0,
        transition: "opacity 0.3s",
      }} />

      {/* Team pill */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        fontFamily: "var(--f-condensed)", fontWeight: 700,
        fontSize: "clamp(13px, 1.4vw, 17px)", letterSpacing: "0.16em",
        textTransform: "uppercase",
        color:      isActive ? tc.activeText   : tc.pillText,
        background: isActive ? tc.activePillBg : tc.pillBg,
        border: `1.5px solid ${isActive ? tc.activeBorder : tc.pillBorder}`,
        borderRadius: 100, padding: "3px 14px 3px 10px",
        transition: "all 0.3s", userSelect: "none",
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: "50%", background: tc.dot,
          transform: isActive ? "scale(1.28)" : "scale(1)",
          transition: "transform 0.3s", flexShrink: 0,
        }} />
        TEAM {teamNum}
      </div>

      <AnimatedScore value={score} active={isActive} teamNum={teamNum} />

      <div style={{
        fontSize: 10, fontWeight: 600,
        letterSpacing: "0.18em", textTransform: "uppercase",
        color: tc.hint,
        opacity: isActive ? 1 : 0,
        transition: "opacity 0.3s",
        height: 14,
      }}>
        YOUR TURN
      </div>
    </div>
  );
}

/* ── Tile ───────────────────────────────────────────────── */
function Tile({ tile, index, onClick }) {
  const [hov,  setHov]  = useState(false);
  const [pres, setPres] = useState(false);
  const [flip, setFlip] = useState(false);

  const isHidden  = tile.revealState === "hidden";
  const isCorrect = tile.revealState === "correct";
  const isWrong   = tile.revealState === "wrong";
  const isBomb    = tile.revealState === "bomb";
  const isBonus   = tile.revealState === "bonus";
  const isSwap    = tile.revealState === "swap";

  const handleClick = () => {
    if (!isHidden) return;
    setFlip(true);
    setPres(true);
    setTimeout(() => setPres(false), 120);
    onClick(tile.id);
  };

  let bg = "#fff", border = "var(--tile-border)";
  if (isCorrect)          { bg = "var(--teal)";   border = "var(--teal)"; }
  if (isWrong)            { bg = "#f5f5f4";        border = "#d4d4d0"; }
  if (isBomb)             { bg = "var(--red)";     border = "var(--red)"; }
  if (isBonus)            { bg = "var(--yellow)";  border = "var(--yellow)"; }
  if (isSwap)             { bg = "#8b5cf6";        border = "#8b5cf6"; }
  if (isHidden && hov)    { bg = "var(--teal-light)"; border = "var(--teal)"; }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => isHidden && setHov(true)}
      onMouseLeave={() => { setHov(false); setPres(false); }}
      onMouseDown={() => isHidden && setPres(true)}
      onMouseUp={() => setPres(false)}
      style={{
        background: bg, border: `2px solid ${border}`,
        borderRadius: "clamp(10px,1.4vw,16px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: isHidden ? "pointer" : "default",
        aspectRatio: "1 / 1",
        transition: "background 0.22s, border-color 0.22s, box-shadow 0.18s, transform 0.13s",
        transform: pres ? "scale(0.89)" : hov && isHidden ? "scale(1.06)" : "scale(1)",
        boxShadow: hov && isHidden ? "0 6px 20px rgba(13,148,128,0.16)" : "none",
        animation: `tileIn 0.42s ease ${index * 0.036}s both`,
      }}
    >
      {/* Hidden: show number */}
      {isHidden && (
        <span style={{
          fontFamily: "var(--f-condensed)", fontWeight: 700,
          fontSize: "clamp(18px, 2.6vw, 34px)",
          color: "var(--score-neutral)", userSelect: "none", lineHeight: 1,
        }}>
          {tile.id}
        </span>
      )}
      {/* Correct */}
      {isCorrect && (
        <Check size="clamp(18px,2.4vw,28px)" strokeWidth={3} color="#fff"
          style={{ animation: "tileCorrect 0.5s cubic-bezier(.34,1.56,.64,1)" }} />
      )}
      {/* Wrong */}
      {isWrong && (
        <X size="clamp(18px,2.4vw,28px)" strokeWidth={3} color="#a8a29e" />
      )}
      {/* Bomb */}
      {isBomb && (
        <span style={{ fontSize: "clamp(20px,2.6vw,32px)", userSelect: "none", lineHeight: 1,
          animation: "iconPop 0.5s cubic-bezier(.34,1.56,.64,1)" }}>💣</span>
      )}
      {/* Bonus */}
      {isBonus && (
        <span style={{ fontSize: "clamp(20px,2.6vw,32px)", userSelect: "none", lineHeight: 1,
          animation: "iconPop 0.5s cubic-bezier(.34,1.56,.64,1)" }}>🎁</span>
      )}
      {/* Swap */}
      {isSwap && (
        <span style={{ fontSize: "clamp(20px,2.6vw,32px)", userSelect: "none", lineHeight: 1,
          animation: "iconPop 0.5s cubic-bezier(.34,1.56,.64,1)" }}>🔄</span>
      )}
    </div>
  );
}

/* ── Game Board ########################################################################################################### */
export default function GameBoard() {
  const tiles       = useGameStore((s) => s.tiles);
  const scores      = useGameStore((s) => s.scores);
  const currentTeam = useGameStore((s) => s.currentTeam);
  const subject     = useGameStore((s) => s.subject);
  const selectTile  = useGameStore((s) => s.selectTile);
  const resetGame   = useGameStore((s) => s.resetGame);

  return (
    <div style={{
      height: "100vh", width: "100%", overflow: "hidden",
      display: "flex", flexDirection: "column",
      background: "var(--bg-page)", position: "relative",
      fontFamily: "var(--f-regular)",
      animation: "pageIn 0.4s ease both",
    }}>
      {/* ── Header ── */}
      <header style={{
        background: "var(--teal)",
        height: "clamp(48px,6vh,62px)",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(20px,3vw,32px)", flexShrink: 0,
        animation: "fadeDown 0.4s ease both",
      }}>
        <span style={{
          fontFamily: "var(--f-condensed)", fontWeight: 700,
          fontSize: "clamp(13px,1.5vw,18px)",
          letterSpacing: "0.18em", color: "var(--logo)",
          textTransform: "uppercase", userSelect: "none",
        }}>
          THE KINETIC GALLERY
        </span>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <span style={{
            fontFamily: "var(--f-condensed)", fontWeight: 600,
            fontSize: 13, letterSpacing: "0.14em",
            color: "rgba(255,255,255,0.6)", textTransform: "uppercase",
          }}>
            {subject}
          </span>
          <button onClick={resetGame} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "white", display: "flex", alignItems: "center", padding: 4,
            opacity: 0.8, transition: "opacity 0.15s",
          }}>
            <Settings size={20} strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* ── Score Bar ── */}
      <div style={{
        background: "var(--white)",
        borderBottom: "1.5px solid var(--teal-light)",
        display: "flex", alignItems: "stretch", flexShrink: 0,
        animation: "fadeDown 0.45s ease 0.08s both",
      }}>
        <TeamScoreBlock teamNum={1} score={scores[1]} isActive={currentTeam === 1} />
        <div style={{ width: 1, background: "var(--divider)", flexShrink: 0 }} />
        <TeamScoreBlock teamNum={2} score={scores[2]} isActive={currentTeam === 2} />
      </div>

      {/* ── Game Area ── */}
      <main style={{
        flex: 1, minHeight: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "clamp(10px,1.8vh,20px) clamp(14px,3vw,32px)",
        gap: "clamp(10px,1.8vh,18px)",
      }}>
        {/* Turn Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 9,
          border: "1.5px solid var(--teal)",
          borderRadius: 100, padding: "7px 20px",
          background: "var(--white)", flexShrink: 0,
          animation: "fadeDown 0.4s ease 0.12s both",
        }}>
          <span style={{
            width: 9, height: 9, borderRadius: "50%",
            background: "var(--yellow)", flexShrink: 0,
          }} />
          <span style={{
            fontWeight: 600, fontSize: "clamp(11px,1vw,13px)",
            letterSpacing: "0.12em", color: "var(--teal)",
            textTransform: "uppercase", whiteSpace: "nowrap",
          }}>
            TEAM {currentTeam}'S TURN — PICK A TILE
          </span>
        </div>

        {/* Tile Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "clamp(7px,1vw,12px)",
          width: "100%", maxWidth: 680,
        }}>
          {tiles.map((tile, i) => (
            <Tile
              key={tile.id}
              tile={tile}
              index={i}
              onClick={selectTile}
            />
          ))}
        </div>
      </main>
    </div>
  );
}