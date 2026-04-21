import { useState, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import useGameStore from "../../store/useGameStore";

const TEAM_COLORS = {
  1: { color: "#dc2626", light: "#fef2f2", border: "#fca5a5", name: "TEAM 1" },
  2: { color: "#2563eb", light: "#eff6ff", border: "#93c5fd", name: "TEAM 2" },
};

/* ── Confetti burst ─────────────────────────────────────── */
const CONF_COLORS = ["#f0c525","#0d9480","#dc2626","#2563eb","#22c55e","#f97316","#a855f7","#ec4899"];

function FullConfetti() {
  const pieces = Array.from({ length: 52 }, (_, i) => ({
    id: i,
    color: CONF_COLORS[i % CONF_COLORS.length],
    left: `${Math.random() * 100}%`,
    size: 7 + Math.random() * 9,
    round: Math.random() > 0.45,
    duration: 1.0 + Math.random() * 1.0,
    delay: Math.random() * 0.6,
  }));

  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
      {pieces.map((p) => (
        <div key={p.id} style={{
          position: "absolute", top: 0,
          left: p.left,
          width: p.size, height: p.size,
          background: p.color,
          borderRadius: p.round ? "50%" : 3,
          animation: `confettiFall ${p.duration}s ease ${p.delay}s both`,
        }} />
      ))}
    </div>
  );
}

/* ── Score Card ─────────────────────────────────────────── */
function ScoreCard({ teamNum, score, isWinner, rank, delay }) {
  const tc = TEAM_COLORS[teamNum];
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div style={{
      background: isWinner ? "var(--teal)" : "#fff",
      border: `2px solid ${isWinner ? "var(--teal)" : tc.border}`,
      borderRadius: 20, padding: "24px 32px",
      textAlign: "center", position: "relative",
      flex: 1,
      opacity: vis ? 1 : 0,
      transform: vis
        ? isWinner ? "scale(1.04) translateY(-4px)" : "scale(1)"
        : "scale(0.88) translateY(20px)",
      transition: "opacity 0.5s ease, transform 0.55s cubic-bezier(.34,1.38,.64,1)",
    }}>
      {isWinner && (
        <div style={{
          position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
          background: "var(--yellow)", color: "var(--yellow-text)",
          fontFamily: "var(--f-condensed)", fontWeight: 700, fontSize: 12,
          letterSpacing: "0.14em", textTransform: "uppercase",
          padding: "4px 16px", borderRadius: 100,
          whiteSpace: "nowrap",
        }}>
          🏆 WINNER
        </div>
      )}

      <div style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        fontFamily: "var(--f-condensed)", fontWeight: 700,
        fontSize: 15, letterSpacing: "0.16em", textTransform: "uppercase",
        color: isWinner ? "rgba(255,255,255,0.7)" : tc.color,
        background: isWinner ? "rgba(255,255,255,0.12)" : tc.light,
        border: `1.5px solid ${isWinner ? "rgba(255,255,255,0.25)" : tc.border}`,
        borderRadius: 100, padding: "3px 14px 3px 10px",
        marginBottom: 14,
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: "50%",
          background: isWinner ? "rgba(255,255,255,0.7)" : tc.color,
          flexShrink: 0,
        }} />
        {tc.name}
      </div>

      <div style={{
        fontFamily: "var(--f-condensed)", fontWeight: 800,
        fontSize: "clamp(48px,8vw,72px)",
        color: isWinner ? "#fff" : "var(--score-neutral)",
        lineHeight: 1, userSelect: "none",
      }}>
        {score}
      </div>
      <div style={{
        fontSize: 13, fontWeight: 500,
        color: isWinner ? "rgba(255,255,255,0.65)" : "var(--muted)",
        marginTop: 4,
      }}>
        points
      </div>
    </div>
  );
}

/* ── Game Over Page ─────────────────────────────────────── */
export default function GameOver() {
  const scores    = useGameStore((s) => s.scores);
  const subject   = useGameStore((s) => s.subject);
  const resetGame = useGameStore((s) => s.resetGame);

  const [titleVis,  setTitleVis]  = useState(false);
  const [btnVis,    setBtnVis]    = useState(false);
  const [showConf,  setShowConf]  = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setTitleVis(true), 200);
    const t2 = setTimeout(() => setBtnVis(true),   900);
    const t3 = setTimeout(() => setShowConf(false), 2200);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  const tied   = scores[1] === scores[2];
  const winner = tied ? 0 : scores[1] > scores[2] ? 1 : 2;

  return (
    <div style={{
      height: "100vh", width: "100%", overflow: "hidden",
      display: "flex", flexDirection: "column",
      background: "var(--bg-page)", position: "relative",
      animation: "pageIn 0.4s ease both",
    }}>
      {showConf && <FullConfetti />}

      {/* Header */}
      <header style={{
        background: "var(--teal)",
        height: "clamp(48px,6vh,62px)",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(20px,3vw,32px)", flexShrink: 0,
      }}>
        <span style={{
          fontFamily: "var(--f-condensed)", fontWeight: 700,
          fontSize: "clamp(13px,1.5vw,18px)",
          letterSpacing: "0.18em", color: "var(--logo)",
          textTransform: "uppercase", userSelect: "none",
        }}>
          THE KINETIC GALLERY
        </span>
        <span style={{
          fontFamily: "var(--f-condensed)", fontWeight: 600,
          fontSize: 13, letterSpacing: "0.14em",
          color: "rgba(255,255,255,0.55)", textTransform: "uppercase",
        }}>
          {subject}
        </span>
      </header>

      {/* Main */}
      <main style={{
        flex: 1, minHeight: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "clamp(24px,4vw,48px)",
        gap: "clamp(20px,3vh,32px)",
        textAlign: "center",
      }}>
        {/* Title */}
        <div style={{
          opacity: titleVis ? 1 : 0,
          transform: titleVis ? "translateY(0)" : "translateY(-20px)",
          transition: "opacity 0.55s ease, transform 0.55s ease",
        }}>
          <div style={{ fontSize: "clamp(48px,8vw,72px)", lineHeight: 1, marginBottom: 8 }}>
            {tied ? "🤝" : "🏆"}
          </div>
          <h1 style={{
            fontFamily: "var(--f-condensed)", fontWeight: 800,
            fontSize: "clamp(32px,6vw,56px)",
            color: "var(--teal-dark)", lineHeight: 1,
            marginBottom: 6,
          }}>
            {tied ? "IT'S A TIE!" : `TEAM ${winner} WINS!`}
          </h1>
          <p style={{
            fontFamily: "var(--f-regular)", fontSize: 15,
            color: "var(--muted)", letterSpacing: "0.06em",
          }}>
            {subject?.toUpperCase()} QUIZ — FINAL SCORES
          </p>
        </div>

        {/* Score Cards */}
        <div style={{
          display: "flex", gap: "clamp(14px,2vw,24px)",
          width: "100%", maxWidth: 560,
          alignItems: "stretch",
        }}>
          <ScoreCard
            teamNum={1} score={scores[1]}
            isWinner={winner === 1} delay={350}
          />
          <ScoreCard
            teamNum={2} score={scores[2]}
            isWinner={winner === 2} delay={480}
          />
        </div>

        {/* Buttons */}
        <div style={{
          display: "flex", flexDirection: "column", gap: 12,
          width: "100%", maxWidth: 340,
          opacity: btnVis ? 1 : 0,
          transform: btnVis ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}>
          <button
            onClick={resetGame}
            style={{
              background: "var(--yellow)", border: "none",
              borderRadius: 14, padding: "clamp(16px,2.2vh,20px)",
              fontFamily: "var(--f-regular)", fontWeight: 700,
              fontSize: "clamp(13px,1.1vw,15px)",
              letterSpacing: "0.08em", textTransform: "uppercase",
              color: "var(--yellow-text)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "background 0.15s, transform 0.12s",
              userSelect: "none",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--yellow-hover)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "var(--yellow)"}
            onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.96)"}
            onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <RotateCcw size={16} /> Play Again
          </button>

          <button
            onClick={resetGame}
            style={{
              background: "#fff",
              border: "2px solid var(--teal-border)",
              borderRadius: 14, padding: "clamp(14px,2vh,18px)",
              fontFamily: "var(--f-regular)", fontWeight: 600,
              fontSize: "clamp(13px,1.1vw,14px)",
              color: "var(--teal-dark)", cursor: "pointer",
              transition: "background 0.15s, transform 0.12s",
              userSelect: "none",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--teal-light)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
            onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.96)"}
            onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            Change Subject
          </button>
        </div>
      </main>
    </div>
  );
}