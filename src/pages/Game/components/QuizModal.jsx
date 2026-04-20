import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, Check, X } from "lucide-react";

/*
  Props:
    question  – see QUESTION_EXAMPLES below for shape
    onClose   – called with (isCorrect: boolean) when done
    teamName  – e.g. "TEAM 1"
*/

// ── Question shape examples ───────────────────────────────
export const QUESTION_EXAMPLES = {
  multipleChoice: {
    type: "multiple_choice",
    badge: "Multiple Choice",
    text: "What is the capital of France?",
    options: ["Paris", "Lyon", "Marseille", "Bordeaux"],
    answer: "Paris",
    points: 10,
  },
  fillBlank: {
    type: "fill_blank",
    badge: "Fill in the Blank",
    text: "The Great Wall of China was built during the _____ dynasty.",
    answer: "ming",
    displayAnswer: "Ming",
    points: 15,
  },
  trueFalse: {
    type: "true_false",
    badge: "True or False",
    text: "The Amazon River is the longest river in the world.",
    answer: false,
    points: 5,
  },
};

// ── Constants ─────────────────────────────────────────────
const TIMER_TOTAL   = 45;
const CIRCUMFERENCE = 2 * Math.PI * 24; // r=24

const C = {
  teal:       "#0d9480",
  tealDark:   "#0a7a6a",
  tealLight:  "#e8f5f2",
  tealBorder: "#9eddd5",
  yellow:     "#f0c525",
  yellowHov:  "#f5d040",
  yellowText: "#0a6659",
  red:        "#dc2626",
  green:      "#22c55e",
};

const F = {
  condensed: "'Barlow Condensed', sans-serif",
  regular:   "'Barlow', sans-serif",
};

// ── Timer Ring ────────────────────────────────────────────
function TimerRing({ timeLeft }) {
  const pct    = timeLeft / TIMER_TOTAL;
  const offset = CIRCUMFERENCE * (1 - pct);
  const warn   = timeLeft <= 10;

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      marginBottom: 14, position: "relative",
    }}>
      <svg width="56" height="56" viewBox="0 0 56 56"
        style={{ transform: "rotate(-90deg)" }}>
        <circle cx="28" cy="28" r="24" fill="none"
          stroke="#f0f0ee" strokeWidth="4" />
        <circle cx="28" cy="28" r="24" fill="none"
          stroke={warn ? C.red : C.teal} strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.4s ease" }}
        />
      </svg>
      <span style={{
        position: "absolute",
        fontFamily: F.condensed, fontWeight: 800, fontSize: 18,
        color: warn ? C.red : C.tealDark,
        animation: warn ? "pulseTxt 0.7s ease infinite alternate" : "none",
        transition: "color 0.4s ease",
      }}>
        {timeLeft}
      </span>
    </div>
  );
}

// ── Option Button ─────────────────────────────────────────
function OptionBtn({ label, selected, disabled, onClick, delay = 0 }) {
  const [hov, setHov] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={() => { if (!disabled) onClick(); }}
      onMouseEnter={() => !selected && !disabled && setHov(true)}
      onMouseLeave={() => { setHov(false); setPressed(false); }}
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      disabled={disabled}
      style={{
        border: `2px solid ${selected ? C.teal : hov ? C.teal : C.tealBorder}`,
        background: selected ? C.teal : hov ? C.tealLight : "#fff",
        borderRadius: 14,
        padding: "16px 14px",
        fontFamily: F.regular,
        fontWeight: 600, fontSize: 15,
        color: selected ? "#fff" : C.tealDark,
        cursor: disabled ? "default" : "pointer",
        position: "relative", overflow: "hidden",
        transform: pressed ? "scale(0.95)" : "scale(1)",
        transition: "border-color .2s, background .2s, color .2s, transform .13s",
        animation: `optIn 0.4s ease ${delay}s both`,
      }}
    >
      {label}
    </button>
  );
}

// ── TF Button ─────────────────────────────────────────────
function TFBtn({ label, icon, selected, disabled, onClick, delay = 0 }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => { if (!disabled) onClick(); }}
      onMouseEnter={() => !selected && !disabled && setHov(true)}
      onMouseLeave={() => setHov(false)}
      disabled={disabled}
      style={{
        border: `2px solid ${selected ? C.teal : hov ? C.teal : C.tealBorder}`,
        background: selected ? C.teal : hov ? C.tealLight : "#fff",
        borderRadius: 14, padding: "22px 14px",
        fontFamily: F.condensed, fontWeight: 800, fontSize: 22,
        color: selected ? "#fff" : C.tealDark,
        cursor: disabled ? "default" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        transition: "all .2s ease",
        animation: `optIn 0.4s ease ${delay}s both`,
      }}
    >
      <span style={{
        fontSize: 22,
        color: selected ? "#fff"
          : label === "TRUE" ? C.green : C.red,
        transition: "color .2s",
      }}>
        {icon}
      </span>
      {label}
    </button>
  );
}

// ── Result Screen ─────────────────────────────────────────
function ResultScreen({ isCorrect, correctAnswer, points, onNext, onBack }) {
  return (
    <div style={{
      textAlign: "center", padding: "8px 0",
      animation: "resultIn .5s cubic-bezier(.34,1.38,.64,1) both",
    }}>
      <span style={{
        fontSize: 64, display: "block", margin: "0 auto 12px",
        animation: "iconPop .6s cubic-bezier(.34,1.56,.64,1) both",
      }}>
        {isCorrect ? "🎉" : "😬"}
      </span>

      <div style={{
        fontFamily: F.condensed, fontWeight: 800, fontSize: 34, marginBottom: 8,
        color: isCorrect ? C.teal : C.red,
      }}>
        {isCorrect ? "Correct!" : "Oops!"}
      </div>

      {isCorrect ? (
        <div style={{
          display: "inline-block",
          background: C.tealLight, color: C.tealDark,
          fontFamily: F.condensed, fontWeight: 800, fontSize: 18,
          padding: "6px 20px", borderRadius: 100,
          marginBottom: 24,
          animation: "ptsIn .5s ease .3s both",
        }}>
          +{points} points
        </div>
      ) : (
        <>
          <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>
            The correct answer was:
          </p>
          <p style={{
            fontSize: 15, fontWeight: 700, color: C.red,
            marginBottom: 22,
          }}>
            {correctAnswer}
          </p>
        </>
      )}

      <div style={{ display: "grid", gap: 10 }}>
        <button onClick={onNext} style={{
          background: C.teal, border: "none", borderRadius: 14,
          padding: 15, fontFamily: F.regular, fontWeight: 700,
          fontSize: 14, color: "#fff", cursor: "pointer",
          transition: "background .15s",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          Next Question <ArrowRight size={16} />
        </button>
        {!isCorrect && (
          <button onClick={onBack} style={{
            background: "#fff",
            border: `2px solid #fca5a5`,
            borderRadius: 14, padding: "13px 15px",
            fontFamily: F.regular, fontWeight: 700,
            fontSize: 14, color: C.red, cursor: "pointer",
            transition: "background .15s",
          }}>
            Back to Board
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main Modal ────────────────────────────────────────────
export default function QuizModal({ question, onClose }) {
  const [timeLeft,   setTimeLeft]   = useState(TIMER_TOTAL);
  const [selected,   setSelected]   = useState(null);
  const [fillValue,  setFillValue]  = useState("");
  const [phase,      setPhase]      = useState("answering"); // answering | result
  const [isCorrect,  setIsCorrect]  = useState(null);
  const [shake,      setShake]      = useState(false);

  const timerRef = useRef(null);

  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }, []);

  const revealResult = useCallback((correct) => {
    clearInterval(timerRef.current);
    setIsCorrect(correct);
    setPhase("result");
    if (!correct) triggerShake();
  }, [triggerShake]);

  // Timer
  useEffect(() => {
    if (phase !== "answering") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          revealResult(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, revealResult]);

  // Reset on question change
  useEffect(() => {
    setTimeLeft(TIMER_TOTAL);
    setSelected(null);
    setFillValue("");
    setPhase("answering");
    setIsCorrect(null);
  }, [question]);

  const handleCheck = () => {
    if (phase !== "answering") return;
    clearInterval(timerRef.current);
    let correct = false;
    if (question.type === "multiple_choice") {
      correct = selected === question.answer;
    } else if (question.type === "true_false") {
      correct = selected === question.answer;
    } else {
      correct = fillValue.trim().toLowerCase() === question.answer.toLowerCase();
    }
    setTimeout(() => revealResult(correct), 200);
  };

  const canCheck = question.type === "fill_blank"
    ? fillValue.trim().length > 0
    : selected !== null;

  const correctDisplayAnswer =
    question.type === "true_false"
      ? (question.answer ? "TRUE" : "FALSE")
      : question.displayAnswer || question.answer;

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(10,100,88,0.55)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, zIndex: 100,
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 24,
        width: "100%", maxWidth: 440,
        padding: "28px 28px 24px",
        position: "relative", overflow: "hidden",
        animation: `modalIn 0.45s cubic-bezier(.34,1.38,.64,1) both`,
        transform: shake ? undefined : undefined,
      }}>
        {/* Phase: answering */}
        {phase === "answering" && (
          <>
            <TimerRing timeLeft={timeLeft} />

            {/* Badge */}
            <div style={{ marginBottom: 14 }}>
              <span style={{
                display: "inline-block",
                background: C.yellow, color: C.yellowText,
                fontFamily: F.condensed, fontWeight: 700, fontSize: 12,
                letterSpacing: ".14em", textTransform: "uppercase",
                padding: "5px 16px", borderRadius: 100,
                animation: "badgeIn .4s ease .15s both",
              }}>
                {question.badge}
              </span>
            </div>

            {/* Question */}
            <div style={{
              fontFamily: F.condensed, fontWeight: 700,
              fontSize: "clamp(20px,3.5vw,26px)",
              color: C.tealDark, lineHeight: 1.25,
              marginBottom: 22,
              animation: "qIn .45s ease .2s both",
            }}>
              {question.text}
            </div>

            {/* Multiple choice */}
            {question.type === "multiple_choice" && (
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr",
                gap: 12, marginBottom: 20,
              }}>
                {question.options.map((opt, i) => (
                  <OptionBtn
                    key={opt} label={opt}
                    selected={selected === opt}
                    disabled={false}
                    onClick={() => setSelected(opt)}
                    delay={0.18 + i * 0.07}
                  />
                ))}
              </div>
            )}

            {/* Fill blank */}
            {question.type === "fill_blank" && (
              <input
                value={fillValue}
                onChange={e => setFillValue(e.target.value)}
                placeholder="Type your answer..."
                autoComplete="off"
                style={{
                  width: "100%",
                  border: `2px solid ${C.tealBorder}`,
                  borderRadius: 14, padding: "16px 18px",
                  fontFamily: F.regular, fontWeight: 600, fontSize: 16,
                  color: C.tealDark, outline: "none",
                  marginBottom: 20,
                  animation: "optIn .4s ease .2s both",
                  transition: "border-color .2s",
                }}
                onFocus={e => e.target.style.borderColor = C.teal}
                onBlur={e => e.target.style.borderColor = C.tealBorder}
              />
            )}

            {/* True / False */}
            {question.type === "true_false" && (
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr",
                gap: 12, marginBottom: 20,
              }}>
                <TFBtn label="TRUE"  icon="✓" selected={selected === true}  disabled={false} onClick={() => setSelected(true)}  delay={0.18} />
                <TFBtn label="FALSE" icon="✗" selected={selected === false} disabled={false} onClick={() => setSelected(false)} delay={0.25} />
              </div>
            )}

            {/* Check button */}
            <button
              onClick={handleCheck}
              disabled={!canCheck}
              style={{
                width: "100%",
                background: canCheck ? C.yellow : "#f0f0ee",
                border: "none", borderRadius: 14, padding: 17,
                fontFamily: F.regular, fontWeight: 700, fontSize: 15,
                letterSpacing: ".08em",
                color: canCheck ? C.yellowText : "#aaa",
                cursor: canCheck ? "pointer" : "default",
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: 8,
                transition: "background .15s, color .15s, transform .12s",
                animation: "btnIn .4s ease .4s both",
              }}
            >
              Check <ArrowRight size={16} />
            </button>
          </>
        )}

        {/* Phase: result */}
        {phase === "result" && (
          <ResultScreen
            isCorrect={isCorrect}
            correctAnswer={correctDisplayAnswer}
            points={question.points}
            onNext={() => onClose?.(isCorrect)}
            onBack={() => onClose?.(false)}
          />
        )}
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity:0; transform:scale(0.82) translateY(20px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes badgeIn {
          from { opacity:0; transform:scale(0.7); }
          to   { opacity:1; transform:scale(1); }
        }
        @keyframes qIn {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes optIn {
          from { opacity:0; transform:translateY(14px) scale(0.96); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes btnIn {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes resultIn {
          from { opacity:0; transform:scale(0.8) translateY(16px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes iconPop {
          from { transform:scale(0) rotate(-20deg); }
          to   { transform:scale(1) rotate(0); }
        }
        @keyframes ptsIn {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pulseTxt {
          to { transform:scale(1.12); }
        }
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          15%{transform:translateX(-8px)}
          30%{transform:translateX(8px)}
          45%{transform:translateX(-6px)}
          60%{transform:translateX(6px)}
          75%{transform:translateX(-3px)}
          90%{transform:translateX(3px)}
        }
      `}</style>
    </div>
  );
}

/*
  Usage:
  import QuizModal, { QUESTION_EXAMPLES } from "./QuizModal";

  <QuizModal
    question={QUESTION_EXAMPLES.multipleChoice}
    onClose={(wasCorrect) => {
      // handle score, close modal, switch turn, etc.
      setModalOpen(false);
    }}
  />
*/