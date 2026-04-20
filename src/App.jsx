import { Route, Routes } from "react-router-dom"
import QuizGame from "./pages/Home/Home"
import GameBoard from "./pages/Game/Game"


function App() {
  return (
    <Routes>
      <Route path="/" element={<QuizGame/>}/>
      <Route path="/game" element={<GameBoard/>}/>
      <Route path="*" element={<h1>404 - Sahifa topilmadi</h1>} />
    </Routes>

  )
}

export default App
