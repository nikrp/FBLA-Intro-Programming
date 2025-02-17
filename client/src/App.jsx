import { Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Register from "./pages/Register"
import Login from "./pages/Login"
import GameHub from "./pages/GameHub"
import GameHub2 from "./pages/GameHub2"
import Solo from "./pages/Solo"

function App() {
  return (
    <div>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/game-hub" element={<GameHub />} />
        <Route path="/game-hub2" element={<GameHub2 />} />
        <Route path="/adventure" element={<Solo />} />
      </Routes>
    </div>
  )
}

export default App
