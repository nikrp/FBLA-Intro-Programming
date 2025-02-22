import { useState } from "react";
import { createClient } from '@supabase/supabase-js'
import { useNavigate } from "react-router-dom";

const supabase = createClient('https://ejmvozkmcwtzffqfctfs.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbXZvemttY3d0emZmcWZjdGZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwODgxNDYsImV4cCI6MjA1NDY2NDE0Nn0.IfKuBiTTKG64KkQay_C7yhKTMJOKpm8iDBxU8uLG92I')

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function loginUser() {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (data.user) {
            navigate("/game-hub", { replace: true });
        }
    }

    return (
        <div className={`w-screen min-h-screen bg-purple-300 px-2.5 flex justify-center items-center`}>
            {/* Back to Landing Page Button */}
            <button className={`bg-yellow-200 px-4 py-2 rounded-lg fixed top-5 left-5 cursor-pointer hover:opacity-80 transition-all duration-200 ease-in-out`}>← Back</button>

            {/* Registration Form */}
            <div className={`flex w-screen`}>
                <div className={`w-6/12 my-2.5 py-5 px-20 flex flex-col justify-center`}>
                    <p className={`text-center text-3xl`}>Welcome Back!</p>
                    <p className={`text-black text-lg text-center my-3`}>Continue Adventuring with Ease.</p>
                    <div className={`h-px rounded-full bg-black mt-2 mb-6`} />
                    <p className={`text-lg mb-1`}>Email</p>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type={`email`} className={`px-5 py-3 rounded-lg mb-3 bg-white placeholder:text-gray-400 w-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-300`} placeholder={`someone@example.com`} />
                    <p className={`text-lg mb-1`}>Password</p>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type={`password`} className={`px-5 py-3 rounded-lg mb-5 bg-white placeholder:text-gray-400 w-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-300`} placeholder={`•••••••••••`} />
                    <button onClick={loginUser} className={`bg-yellow-200 hover:opacity-80 mb-1.5 transition-all duration-200 ease-in-out px-4 py-2 rounded-lg text-lg cursor-pointer`}>Login</button>
                    <div className={`flex justify-between`}>
                        <p>Don't Have an Account? <span onClick={() => navigate("/register", { replace: true })} className={`text-purple-800 cursor-pointer hover:opacity-70 transition-all duration-200 ease-in-out`}>Register Today</span></p>
                    </div>
                </div>
                <div className={`w-6/12 h-screen`}></div>
            </div>
        </div>
    );
}