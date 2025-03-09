import { Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Solo from "./pages/Solo"
import Battle from "./pages/Battle"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON)

function App() {
  return (
    <div data-theme="dark">
      <Routes>
        <Route path="/" element={<LandingPage supabase={supabase}/>} />
        <Route path="/adventure" element={<Solo supabase={supabase} />} />
        <Route path="/battle" element={<Battle supabase={supabase} />} />
      </Routes>
    </div>
  )
}

export default App
