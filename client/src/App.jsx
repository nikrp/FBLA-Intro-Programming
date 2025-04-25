// Import necessary modules and components from React Router and Supabase
import { Route, Routes } from "react-router-dom" // Used for defining application routes
import LandingPage from "./pages/LandingPage" // Landing page component
import Solo from "./pages/Solo" // Solo adventure page component
import { createClient } from "@supabase/supabase-js" // Supabase client for database interaction

// Initialize the Supabase client using environment variables for configuration
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON)

/**
 * The main App component that defines the structure of the application.
 * It sets up routing for the application and passes the Supabase client
 * to child components as a prop.
 *
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
  return (
    <div data-theme="dark"> {/* Sets the theme of the application to dark */}
      <Routes>
        {/* Define the route for the landing page */}
        <Route path="/" element={<LandingPage supabase={supabase}/>} />
        
        {/* Define the route for the solo adventure page */}
        <Route path="/adventure" element={<Solo supabase={supabase} />} />
      </Routes>
    </div>
  )
}

export default App // Export the App component as the default export
