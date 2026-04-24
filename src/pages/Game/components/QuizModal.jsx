import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import useGameStore from "../../../store/useGameStore";

const TIMER_TOTAL   = 45;
const CIRCUMFERENCE = 2 * Math.PI * 24;

// ── Confetti ──────────────────────────────────────────────
const CONF_COLORS = ["#f0c525","#0d9480","#dc2626","#2563eb","#22c55e","#f97316","#a855f7"];
function Confetti() {
  const pieces = Array.from({ length: 34 }, (_, i) => ({
    id: i, color: CONF_COLORS[i % CONF_COLORS.length],
    left: `${4 + Math.random() * 92}%`,
    size: 7 + Math.random() * 9, round: Math.random() > 0.45,
    duration: 0.75 + Math.random() * 0.8, delay: Math.random() * 0.4,
  }));
  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden", borderRadius:"inherit" }}>
      {pieces.map((p) => (
        <div key={p.id} style={{
          position:"absolute", left:p.left, top:0,
          width:p.size, height:p.size, background:p.color,
          borderRadius: p.round ? "50%" : 3,
          animation:`confettiFall ${p.duration}s ease ${p.delay}s both`,
        }}/>
      ))}
    </div>
  );
}

// ── Timer Ring ────────────────────────────────────────────
function TimerRing({ timeLeft }) {
  const warn   = timeLeft <= 10;
  const offset = CIRCUMFERENCE * (1 - timeLeft / TIMER_TOTAL);
  return (
    <div style={{ position:"relative", display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
      <svg width="60" height="60" viewBox="0 0 56 56" style={{ transform:"rotate(-90deg)" }}>
        <circle cx="28" cy="28" r="24" fill="none" stroke="#f0f0ee" strokeWidth="4.5"/>
        <circle cx="28" cy="28" r="24" fill="none"
          stroke={warn ? "var(--red)" : "var(--teal)"}
          strokeWidth="4.5" strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE} strokeDashoffset={offset}
          style={{ transition:"stroke-dashoffset 0.9s linear, stroke 0.45s ease" }}
        />
      </svg>
      <span style={{
        position:"absolute", fontFamily:"var(--f-condensed)", fontWeight:800, fontSize:20,
        color: warn ? "var(--red)" : "var(--teal-dark)", transition:"color 0.4s",
        animation: warn ? "pulseTxt 0.7s ease infinite alternate" : "none",
      }}>
        {timeLeft}
      </span>
    </div>
  );
}

// ── Ripple ────────────────────────────────────────────────
function spawnRipple(el) {
  const r = document.createElement("span");
  r.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);
    width:150px;height:150px;left:50%;top:50%;margin:-75px;pointer-events:none;
    animation:ripple 0.5s ease both;`;
  el.appendChild(r);
  setTimeout(() => r.remove(), 560);
}

// ── MC Option ─────────────────────────────────────────────
function OptionBtn({ label, selected, disabled, onClick, delay, order }) {
  const [hov, setHov]   = useState(false);
  const [pres, setPres] = useState(false);
  const ref = useRef(null);
  const handle = () => {
    if (disabled) return;
    if (ref.current) spawnRipple(ref.current);
    setPres(true); setTimeout(() => setPres(false), 140); onClick();
  };
  return (
    <button ref={ref} onClick={handle}
      onMouseEnter={() => !selected && !disabled && setHov(true)}
      onMouseLeave={() => { setHov(false); setPres(false); }}
      disabled={disabled}
      style={{
        fontFamily:"var(--f-regular)", fontWeight:600,
        fontSize:"clamp(15px,1.5vw,18px)",
        color: selected ? "#fff" : "var(--teal-dark)",
        background: selected ? "var(--teal)" : hov ? "var(--teal-light)" : "#fff",
        border:`2px solid ${selected ? "var(--teal)" : hov ? "var(--teal)" : "var(--teal-border)"}`,
        borderRadius:16, padding:"clamp(18px,2.5vh,24px) 18px",
        cursor: disabled ? "default" : "pointer",
        position:"relative", overflow:"hidden",
        transform: pres ? "scale(0.93)" : "scale(1)",
        transition:"background 0.18s, border-color 0.18s, color 0.18s, transform 0.12s",
        animation:`optIn 0.4s ease ${delay}s both`,
        userSelect:"none",
      }}>
        <span style={{backgroundColor: "#0d9480", position: "absolute", left: 0, top: 0, width: 20, color: "white"}}>
          {order+1}
        </span>
        {label}
    </button>
  );
}

// ── OK / OOPS ─────────────────────────────────────────────
function JudgeButtons({ onOK, onOops }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, animation:"optIn 0.4s ease 0.1s both" }}>
      <button onClick={onOK}
        onMouseDown={(e) => e.currentTarget.style.transform="scale(0.95)"}
        onMouseUp={(e)   => e.currentTarget.style.transform="scale(1)"}
        onMouseLeave={(e)=> e.currentTarget.style.transform="scale(1)"}
        onMouseEnter={(e)=> e.currentTarget.style.background="var(--teal-dark)"}
        style={{
          background:"var(--teal)", border:"none", borderRadius:16,
          padding:"clamp(16px,2.4vh,22px)",
          fontFamily:"var(--f-condensed)", fontWeight:800,
          fontSize:"clamp(18px,2.2vw,22px)", letterSpacing:"0.08em",
          color:"#fff", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center", gap:10,
          transition:"background 0.15s, transform 0.12s", userSelect:"none",
        }}>
        <Check size={22} strokeWidth={3}/> OK
      </button>
      <button onClick={onOops}
        onMouseDown={(e) => e.currentTarget.style.transform="scale(0.95)"}
        onMouseUp={(e)   => e.currentTarget.style.transform="scale(1)"}
        onMouseLeave={(e)=> { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.background="#fff"; }}
        onMouseEnter={(e)=> e.currentTarget.style.background="var(--red-light)"}
        style={{
          background:"#fff", border:"2px solid var(--red-border)", borderRadius:16,
          padding:"clamp(16px,2.4vh,22px)",
          fontFamily:"var(--f-condensed)", fontWeight:800,
          fontSize:"clamp(18px,2.2vw,22px)", letterSpacing:"0.08em",
          color:"var(--red)", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center", gap:10,
          transition:"background 0.15s, transform 0.12s", userSelect:"none",
        }}>
        <X size={22} strokeWidth={3}/> OOPS
      </button>
    </div>
  );
}

// ── Check Button ──────────────────────────────────────────
function CheckBtn({ onClick, disabled }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => !disabled && setHov(true)}
      onMouseLeave={() => setHov(false)}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform="scale(0.96)"; }}
      onMouseUp={(e)   => e.currentTarget.style.transform="scale(1)"}
      style={{
        width:"100%",
        background: disabled ? "#f0f0ee" : hov ? "var(--yellow-hover)" : "var(--yellow)",
        border:"none", borderRadius:18,
        padding:"clamp(19px,2.6vh,26px)",
        fontFamily:"var(--f-regular)", fontWeight:700,
        fontSize:"clamp(15px,1.4vw,18px)", letterSpacing:"0.08em",
        color: disabled ? "#aaa" : "var(--yellow-text)",
        cursor: disabled ? "default" : "pointer",
        display:"flex", alignItems:"center", justifyContent:"center", gap:10,
        transition:"background 0.15s, transform 0.12s",
        animation:"btnIn 0.4s ease 0.42s both", userSelect:"none",
      }}>
      Check <ArrowRight size={18}/>
    </button>
  );
}

// ── Result Screen ─────────────────────────────────────────
function ResultScreen({ isCorrect, correctAnswer, points, onContinue }) {
  const [showConf, setShowConf] = useState(isCorrect);
  useEffect(() => {
    if (isCorrect) { const t = setTimeout(() => setShowConf(false), 1500); return () => clearTimeout(t); }
  }, [isCorrect]);

  return (
    <div style={{ textAlign:"center", padding:"6px 0", animation:"resultIn 0.5s cubic-bezier(.34,1.38,.64,1) both" }}>
      {showConf && <Confetti/>}
      <span style={{
        fontSize:"clamp(72px,10vw,88px)", display:"block", margin:"0 auto 16px", lineHeight:1,
        animation:"iconPop 0.6s cubic-bezier(.34,1.56,.64,1) both",
      }}>
        {isCorrect ? "🎉" : "😬"}
      </span>
      <div style={{
        fontFamily:"var(--f-condensed)", fontWeight:800,
        fontSize:"clamp(34px,5vw,46px)", marginBottom:14,
        color: isCorrect ? "var(--teal)" : "var(--red)",
      }}>
        {isCorrect ? "Correct!" : "Wrong!"}
      </div>
      {isCorrect ? (
        <div style={{
          display:"inline-block",
          background:"var(--teal-light)", color:"var(--score-neutral)",
          fontFamily:"var(--f-condensed)", fontWeight:800, fontSize:24,
          padding:"10px 32px", borderRadius:100, marginBottom:32,
          animation:"ptsIn 0.5s ease 0.3s both",
        }}>
          +{points} points
        </div>
      ) : (
        // ── CHANGED: correctAnswer shown for ALL question types (mc + fill_blank)
        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:16, color:"var(--muted)", marginBottom:6 }}>Correct answer:</div>
          <div style={{ fontFamily:"var(--f-condensed)", fontWeight:700, fontSize:24, color:"var(--red)" }}>
            {correctAnswer}
          </div>
        </div>
      )}
      <button onClick={onContinue}
        onMouseEnter={(e)=> e.currentTarget.style.background="var(--teal-dark)"}
        onMouseLeave={(e)=> e.currentTarget.style.background="var(--teal)"}
        onMouseDown={(e)=> e.currentTarget.style.transform="scale(0.96)"}
        onMouseUp={(e)  => e.currentTarget.style.transform="scale(1)"}
        style={{
          width:"100%", background:"var(--teal)", border:"none", borderRadius:18,
          padding:"clamp(18px,2.5vh,24px)",
          fontFamily:"var(--f-regular)", fontWeight:700,
          fontSize:"clamp(15px,1.4vw,18px)", color:"#fff", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center", gap:10,
          transition:"background 0.15s, transform 0.12s", userSelect:"none",
        }}>
        Continue <ArrowRight size={20}/>
      </button>
    </div>
  );
}

// ── Special Tile Screen (bomb / bonus / swap) ─────────────
function SpecialScreen({ special, onConfirm }) {
  const isBomb  = special.stype === "bomb";
  const isBonus = special.stype === "bonus";
  const isSwap  = special.stype === "swap";

  const emoji    = isBomb ? "💣" : isBonus ? "🎁" : "🔄";
  const color    = isBomb ? "var(--red)" : isBonus ? "var(--teal)" : "#8b5cf6";
  const bgAccent = isBomb ? "#fef2f2" : isBonus ? "var(--teal-light)" : "#f5f3ff";
  const title    = isBomb  ? "BOMB!"
                 : isBonus ? "BONUS!"
                 : "SWAP!";
  const effect   = isBomb  ? `−${special.points} points`
                 : isBonus ? `+${special.points} points`
                 : "Scores exchanged!";
  const desc     = isBomb  ? "Ouch! Points have been deducted. Turn passes to the other team."
                 : isBonus ? "Lucky! Bonus points awarded. Turn passes to the other team."
                 : "Both teams' scores have been swapped! Turn passes to the other team.";

  const [hov, setHov] = useState(false);

  return (
    <div style={{ textAlign:"center", padding:"8px 0", animation:"resultIn 0.5s cubic-bezier(.34,1.38,.64,1) both" }}>
      <span style={{
        fontSize:"clamp(80px,13vw,100px)", display:"block", margin:"0 auto 20px", lineHeight:1,
        animation:"iconPop 0.65s cubic-bezier(.34,1.56,.64,1) both",
      }}>
        {emoji}
      </span>

      <div style={{
        fontFamily:"var(--f-condensed)", fontWeight:800,
        fontSize:"clamp(38px,6vw,52px)", color, marginBottom:14,
        animation:"fadeUp 0.4s ease 0.15s both",
      }}>
        {title}
      </div>

      {/* Effect pill */}
      <div style={{
        display:"inline-block",
        background: bgAccent, color,
        fontFamily:"var(--f-condensed)", fontWeight:800,
        fontSize:"clamp(24px,3.5vw,34px)",
        padding:"10px 32px", borderRadius:100, marginBottom:20,
        border:`2.5px solid ${color}`,
        animation:"ptsIn 0.5s ease 0.25s both",
      }}>
        {effect}
      </div>

      <p style={{
        fontSize:"clamp(15px,1.4vw,17px)", color:"var(--muted)",
        marginBottom:32, lineHeight:1.7,
        animation:"fadeUp 0.4s ease 0.3s both",
      }}>
        {desc}
      </p>

      <button onClick={onConfirm}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onMouseDown={(e) => e.currentTarget.style.transform="scale(0.96)"}
        onMouseUp={(e)   => e.currentTarget.style.transform="scale(1)"}
        style={{
          width:"100%", background: color,
          filter: hov ? "brightness(0.88)" : "none",
          border:"none", borderRadius:18,
          padding:"clamp(19px,2.6vh,26px)",
          fontFamily:"var(--f-condensed)", fontWeight:800,
          fontSize:"clamp(18px,2.2vw,22px)", letterSpacing:"0.08em",
          color:"#fff", cursor:"pointer",
          transition:"filter 0.15s, transform 0.12s",
          animation:"btnIn 0.4s ease 0.4s both",
          userSelect:"none",
        }}>
        Got it! →
      </button>
    </div>
  );
}

// ── Badge labels ──────────────────────────────────────────
const BADGE_LABELS = {
  mc:            "Multiple Choice",
  fill_blank:    "Fill in the Blank",
  open_question: "Open Question",
};
const BADGE_COLORS = {
  mc:            { bg:"var(--yellow)",   text:"var(--yellow-text)" },
  fill_blank:    { bg:"#e0f2fe",         text:"#0369a1" },
  open_question: { bg:"#f3e8ff",         text:"#7c3aed" },
};

// ── Main Modal ────────────────────────────────────────────
export default function QuizModal() {
  const activeQuestion  = useGameStore((s) => s.activeQuestion);
  const activeSpecial   = useGameStore((s) => s.activeSpecial);
  const activeTileId    = useGameStore((s) => s.activeTileId);
  const submitAnswer    = useGameStore((s) => s.submitAnswer);
  const confirmSpecial  = useGameStore((s) => s.confirmSpecial);

  const [timeLeft,  setTimeLeft]  = useState(TIMER_TOTAL);
  const [selected,  setSelected]  = useState(null);
  // phase: "answering" | "judge" | "result"
  const [phase,     setPhase]     = useState("answering");
  const [isCorrect, setIsCorrect] = useState(null);
  const [shake,     setShake]     = useState(false);
  const timerRef = useRef(null);

  const q = activeQuestion;

  const triggerShake = useCallback(() => {
    setShake(true); setTimeout(() => setShake(false), 520);
  }, []);

  const revealResult = useCallback((correct) => {
    clearInterval(timerRef.current);
    setIsCorrect(correct);
    setPhase("result");
    if (!correct) triggerShake();
  }, [triggerShake]);

  // Timer — only for question tiles in answering phase
  useEffect(() => {
    if (!q || phase !== "answering") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          if (q.qtype === "mc") revealResult(false);
          else setPhase("judge");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, q, revealResult]);

  // ── Special tile: just show SpecialScreen
  if (activeSpecial) {
    return (
      <ModalShell shake={false}>
        <SpecialScreen special={activeSpecial} onConfirm={confirmSpecial}/>
      </ModalShell>
    );
  }

  if (!q) return null;

  const handleCheck = () => {
    clearInterval(timerRef.current);
    if (q.qtype === "mc") revealResult(selected === q.answer);
    else setPhase("judge");
  };

  const handleOK   = () => revealResult(true);
  const handleOops = () => revealResult(false);

  const bc = BADGE_COLORS[q.qtype] ?? BADGE_COLORS.mc;
  const canCheck = q.qtype === "mc" ? selected !== null : true;

  return (
    <ModalShell shake={shake}>
      {/* ── Answering phase ── */}
      {phase === "answering" && (
        <>
          {/* ── CHANGED: Header row — Question ID (left) + Timer (right) */}
          <div style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            marginBottom:18, animation:"badgeIn 0.4s ease 0.1s both",
          }}>
            {/* Question ID badge */}
            <div style={{
              display:"flex", alignItems:"center", gap:6,
              background:"#f3f4f6", borderRadius:100,
              padding:"6px 16px",
            }}>
              <span style={{
                fontFamily:"var(--f-condensed)", fontWeight:700,
                fontSize:13, letterSpacing:"0.12em",
                textTransform:"uppercase", color:"#6b7280",
              }}>
                #
              </span>
              <span style={{
                fontFamily:"var(--f-condensed)", fontWeight:800,
                fontSize:18, color:"var(--teal-dark)",
              }}>
                {q.id}
              </span>
            </div>

            {/* Timer ring — top right */}
            <TimerRing timeLeft={timeLeft}/>
          </div>

          {/* Badge */}
          <div style={{ marginBottom:18 }}>
            <span style={{
              display:"inline-block",
              background: bc.bg, color: bc.text,
              fontFamily:"var(--f-condensed)", fontWeight:700, fontSize:15,
              letterSpacing:"0.14em", textTransform:"uppercase",
              padding:"7px 20px", borderRadius:100,
              animation:"badgeIn 0.4s ease 0.2s both",
            }}>
              {BADGE_LABELS[q.qtype] ?? q.qtype} · {q.points} pts
            </span>
          </div>

          {/* Question */}
          <div style={{
            fontFamily:"var(--f-condensed)", fontWeight:700,
            fontSize:"clamp(22px,3.2vw,32px)",
            color:"var(--teal-dark)", lineHeight:1.3,
            marginBottom:"clamp(20px,3vh,32px)",
            animation:"qIn 0.45s ease 0.2s both",
          }}>
            {q.text}
          </div>

          {/* MC options */}
          {q.qtype === "mc" && (
            <div style={{
              display:"grid", gridTemplateColumns:"1fr 1fr",
              gap:"clamp(12px,1.8vw,20px)",
              marginBottom:"clamp(20px,3vh,30px)",
            }}>
              {q.options.map((opt, i) => (
                <OptionBtn key={opt} label={opt}
                  selected={selected === opt} disabled={false}
                  onClick={() => setSelected(opt)}
                  delay={0.18 + i * 0.07}
                  order={i}
                />
              ))}
            </div>
          )}

          {/* fill_blank / open_question hint */}
          {(q.qtype === "fill_blank" || q.qtype === "open_question") && (
            <div style={{
              background: bc.bg, borderRadius:16,
              padding:"18px 22px", marginBottom:"clamp(18px,2.8vh,28px)",
              fontSize:16, color: bc.text, fontWeight:600,
              animation:"optIn 0.4s ease 0.22s both",
              lineHeight:1.6,
            }}>
              {q.qtype === "fill_blank"
                ? "🎤 Team answers verbally — press Check to reveal the correct answer"
                : "🎤 Team gives their answer — press Check when ready to judge"}
            </div>
          )}

          <CheckBtn onClick={handleCheck} disabled={!canCheck}/>
        </>
      )}

      {/* ── Judge phase (fill_blank / open_question) ── */}
      {phase === "judge" && (
        <div style={{ animation:"resultIn 0.45s cubic-bezier(.34,1.38,.64,1) both" }}>
          <div style={{ marginBottom:14 }}>
            <span style={{
              display:"inline-block",
              background:"#f3e8ff", color:"#7c3aed",
              fontFamily:"var(--f-condensed)", fontWeight:700, fontSize:13,
              letterSpacing:"0.14em", textTransform:"uppercase",
              padding:"6px 18px", borderRadius:100,
            }}>
              Teacher's Call · {q.points} pts
            </span>
          </div>

          <div style={{
            fontFamily:"var(--f-condensed)", fontWeight:700,
            fontSize:"clamp(17px,2.4vw,24px)",
            color:"var(--teal-dark)", lineHeight:1.3, marginBottom:16,
          }}>
            {q.text}
          </div>

          {/* Reveal answer for fill_blank */}
          {q.qtype === "fill_blank" && (
            <div style={{
              background:"var(--teal)", borderRadius:14,
              padding:"14px 18px", marginBottom:20,
              display:"flex", alignItems:"center", gap:12,
            }}>
              <span style={{ fontSize:22 }}>✅</span>
              <div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:3 }}>
                  Correct Answer
                </div>
                <div style={{
                  fontFamily:"var(--f-condensed)", fontWeight:800,
                  fontSize:"clamp(20px,2.8vw,28px)", color:"#fff",
                }}>
                  {q.answer}
                </div>
              </div>
            </div>
          )}

          <p style={{
            fontSize:14, color:"var(--muted)", marginBottom:20,
            textAlign:"center", lineHeight:1.5, fontWeight:500,
          }}>
            {q.qtype === "fill_blank"
              ? "Did the team get it right?"
              : "Was the team's verbal answer correct?"}
          </p>

          <JudgeButtons onOK={handleOK} onOops={handleOops}/>
        </div>
      )}

      {/* ── Result phase ── */}
      {phase === "result" && (
        <ResultScreen
          isCorrect={isCorrect}
          // ── CHANGED: pass q.answer for all question types (mc + fill_blank)
          correctAnswer={q.answer}
          points={q.points}
          onContinue={() => submitAnswer(isCorrect)}
        />
      )}
    </ModalShell>
  );
}

// ── Shared Modal Shell ────────────────────────────────────
function ModalShell({ children, shake }) {
  return (
    <div style={{
      position:"absolute", inset:0,
      background:"rgba(10,100,88,0.50)",
      backdropFilter:"blur(8px)", WebkitBackdropFilter:"blur(8px)",
      display:"flex", alignItems:"top", justifyContent:"center",
      padding:"clamp(12px,2vw,24px)", zIndex:100,
    }}>
      <div style={{
        background:"#fff", borderRadius:32,
        width:"100%", maxWidth:640,
        padding:"clamp(36px,5vh,56px) clamp(36px,5vw,56px) clamp(30px,4vh,48px)",
        position:"relative", overflow:"hidden",
        animation: shake ? "shake 0.5s ease" : "modalIn 0.48s cubic-bezier(.34,1.38,.64,1) both",
        maxHeight:"94vh", overflowY:"auto",
        boxShadow:"0 24px 80px rgba(0,0,0,0.18)",
      }}>
        
        {/* Shimmer on open */}
        <div style={{
          position:"absolute", top:0, left:0, right:0, bottom:0, pointerEvents:"none",
          background:"linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)",
          animation:"shimmer 0.8s ease 0.3s both",
        }}/>
        {children}
      </div>
      <style>{`
        @keyframes qIn   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes btnIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
      
    </div>
  );
}