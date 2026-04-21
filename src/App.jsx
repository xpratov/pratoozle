import "./index.css";
import GameOver from "./pages/Result/Result";
import LandingPage from "./pages/Home/Home";
import GameBoard from "./pages/Game/Game";
import QuizModal from "./pages/Game/components/QuizModal";
import useGameStore from "./store/useGameStore";

export default function App() {
  const phase = useGameStore((s) => s.phase);

  return (
    <div style={{ height: "100vh", width: "100%", overflow: "hidden", position: "relative" }}>
      {/* Landing */}
      {phase === "landing" && <LandingPage />}

      {/* Board is always mounted when in board/modal/toast/gameover phase */}
      {(phase === "board" || phase === "modal" || phase === "toast") && (
        <>
          <GameBoard />
          {phase === "modal" && <QuizModal />}
        </>
      )}

      {phase === "gameover" && <GameOver />}
    </div>
  );
}