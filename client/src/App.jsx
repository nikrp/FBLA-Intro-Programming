import { Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Register from "./pages/Register"
import Login from "./pages/Login"
import GameHub from "./pages/GameHub"
import GameHub2 from "./pages/GameHub2"
import Solo from "./pages/Solo"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient('https://ejmvozkmcwtzffqfctfs.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbXZvemttY3d0emZmcWZjdGZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwODgxNDYsImV4cCI6MjA1NDY2NDE0Nn0.IfKuBiTTKG64KkQay_C7yhKTMJOKpm8iDBxU8uLG92I')

function App() {
  return (
    <div>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/game-hub" element={<GameHub />} />
        <Route path="/game-hub2" element={<GameHub2 />} />
        <Route path="/adventure" element={<Solo supabase={supabase} />} />
        <Route path="/" element={<LandingPage supabase={supabase}/>} />
      </Routes>
    </div>
  )
}

export default App
