import { create } from "zustand";
import allQuestions from "../data/questions.json";

// ── Helpers ───────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Random points: min..max in steps of 5 */
function randPts(min, max) {
  const steps = (max - min) / 5;
  return min + Math.floor(Math.random() * (steps + 1)) * 5;
}

function buildTiles(subject) {
  const bank = allQuestions[subject.toLowerCase()] ?? {};

  // Pick question tiles: 4 mc, 6 fill_blank, 5 open_question (= 15)
  const mcPool  = shuffle(bank.multiple_choice ?? []).slice(0, 7).map(q => ({
    ...q, qtype: "mc", points: randPts(15, 20),
  }));
  const fbPool  = shuffle(bank.fill_blank ?? []).slice(0, 8).map(q => ({
    ...q, qtype: "fill_blank", points: randPts(20, 25),
  }));
  // const oqPool  = shuffle(bank.open_question ?? []).slice(0, 5).map(q => ({
  //   ...q, qtype: "open_question", points: randPts(15, 25),
  // }));

  const questionTiles = shuffle([...mcPool, ...fbPool]);

  // Special tiles: 2 bomb, 2 bonus, 1 swap (= 5)
  const specials = shuffle([
    { stype: "bomb",  points: randPts(5, 20) },
    { stype: "bomb",  points: randPts(5, 20) },
    { stype: "bonus", points: randPts(5, 20) },
    { stype: "bonus", points: randPts(5, 20) },
    { stype: "swap" },
  ]);

  // Build 20 tiles in random order
  const allTiles = shuffle([
    ...questionTiles.map((q, i) => ({
      id:          i + 1,      // placeholder, reassigned below
      tileType:    "question",
      revealState: "hidden",
      question:    q,
    })),
    ...specials.map((s, i) => ({
      id:          i + 1,      // placeholder
      tileType:    s.stype,
      revealState: "hidden",
      special:     s,
    })),
  ]);

  // Assign sequential IDs
  return allTiles.map((t, i) => ({ ...t, id: i + 1 }));
}

// ── Store ─────────────────────────────────────────────────
const useGameStore = create((set, get) => ({
  // ── State
  phase:          "landing",  // "landing" | "board" | "modal" | "gameover"
  subject:        null,
  currentTeam:    1,
  scores:         { 1: 0, 2: 0 },
  tiles:          [],
  activeTileId:   null,
  activeQuestion: null,   // for question tiles
  activeSpecial:  null,   // { stype, points? } for bomb/bonus/swap

  // ── Actions

  startGame: (subject) => {
    set({
      phase:          "board",
      subject,
      currentTeam:    1,
      scores:         { 1: 0, 2: 0 },
      tiles:          buildTiles(subject),
      activeTileId:   null,
      activeQuestion: null,
      activeSpecial:  null,
    });
  },

  /** Any tile click → always opens modal */
  selectTile: (tileId) => {
    const { tiles } = get();
    const tile = tiles.find((t) => t.id === tileId);
    if (!tile || tile.revealState !== "hidden") return;

    if (tile.tileType === "question") {
      set({ phase: "modal", activeTileId: tileId, activeQuestion: tile.question, activeSpecial: null });
    } else {
      // bomb / bonus / swap
      set({ phase: "modal", activeTileId: tileId, activeSpecial: tile.special, activeQuestion: null });
    }
  },

  /** After quiz modal (question tile) — teacher pressed OK or OOPS, or MC auto-graded */
  submitAnswer: (isCorrect) => {
    const { activeTileId, tiles, currentTeam, scores } = get();
    const tile = tiles.find((t) => t.id === activeTileId);
    const pts  = tile?.question?.points ?? 10;

    const newScore = isCorrect
      ? scores[currentTeam] + pts
      : Math.max(0, scores[currentTeam] - pts);

    const nextTeam  = currentTeam === 1 ? 2 : 1;
    const newReveal = isCorrect ? "correct" : "wrong";
    const newTiles  = tiles.map((t) =>
      t.id === activeTileId ? { ...t, revealState: newReveal } : t
    );
    const allDone = newTiles.every((t) => t.revealState !== "hidden");

    set({
      scores:         { ...scores, [currentTeam]: newScore },
      tiles:          newTiles,
      currentTeam:    nextTeam,
      activeTileId:   null,
      activeQuestion: null,
      phase:          allDone ? "gameover" : "board",
    });
  },

  /** After special tile modal dismissed — apply effect and switch turn */
  confirmSpecial: () => {
    const { activeTileId, activeSpecial, tiles, currentTeam, scores } = get();
    const nextTeam = currentTeam === 1 ? 2 : 1;
    let newScores  = { ...scores };

    if (activeSpecial.stype === "bomb") {
      newScores[currentTeam] = Math.max(0, scores[currentTeam] - activeSpecial.points);
    } else if (activeSpecial.stype === "bonus") {
      newScores[currentTeam] = scores[currentTeam] + activeSpecial.points;
    } else if (activeSpecial.stype === "swap") {
      newScores = { 1: scores[2], 2: scores[1] };
    }

    const newTiles = tiles.map((t) =>
      t.id === activeTileId ? { ...t, revealState: activeSpecial.stype } : t
    );
    const allDone = newTiles.every((t) => t.revealState !== "hidden");

    set({
      scores:        newScores,
      tiles:         newTiles,
      currentTeam:   nextTeam,
      activeTileId:  null,
      activeSpecial: null,
      phase:         allDone ? "gameover" : "board",
    });
  },

  resetGame: () => {
    set({
      phase:          "landing",
      subject:        null,
      currentTeam:    1,
      scores:         { 1: 0, 2: 0 },
      tiles:          [],
      activeTileId:   null,
      activeQuestion: null,
      activeSpecial:  null,
    });
  },
}));

export default useGameStore;