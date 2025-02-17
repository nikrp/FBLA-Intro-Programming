import { useState } from "react";
import { createClient } from '@supabase/supabase-js'
import { useNavigate } from "react-router-dom";

const supabase = createClient('https://ejmvozkmcwtzffqfctfs.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbXZvemttY3d0emZmcWZjdGZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwODgxNDYsImV4cCI6MjA1NDY2NDE0Nn0.IfKuBiTTKG64KkQay_C7yhKTMJOKpm8iDBxU8uLG92I')

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function registerUser() {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    display_name: "nikrp01",
                },
            },
        });

        navigate("/login", { replace: true });
    }

    return (
        <div className={`w-screen min-h-screen bg-purple-300 px-2.5 flex justify-center items-center`}>
            {/* Back to Landing Page Button */}
            <button className={`bg-yellow-200 px-4 py-2 rounded-lg fixed top-5 left-5 cursor-pointer hover:opacity-80 transition-all duration-200 ease-in-out`}>← Back</button>

            {/* Registration Form */}
            <div className={`flex w-screen`}>
                <div className={`w-6/12 my-2.5 py-5 px-20 flex flex-col justify-center`}>
                    <p className={`text-center text-3xl`}>Register Today!</p>
                    <p className={`text-black text-lg text-center my-3`}>Discover adventure with the click of a button.</p>
                    <div className={`h-px rounded-full bg-black mt-2 mb-6`} />
                    <div className={`flex gap-2 mb-3`}>
                        <div className={`w-full`}>
                            <p className={`text-lg mb-1`}>First Name</p>
                            <input type={`text`} className={`px-5 py-3 rounded-lg bg-white placeholder:text-gray-400 w-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-300`} placeholder={`John`} />
                        </div>
                        <div className={`w-full`}>
                            <p className={`text-lg mb-1`}>Last Name</p>
                            <input type={`text`} className={`px-5 py-3 rounded-lg bg-white placeholder:text-gray-400 w-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-300`} placeholder={`Doe`} />
                        </div>
                    </div>
                    <p className={`text-lg mb-1`}>Email</p>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type={`email`} className={`px-5 py-3 rounded-lg mb-3 bg-white placeholder:text-gray-400 w-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-300`} placeholder={`someone@example.com`} />
                    <p className={`text-lg mb-1`}>Username</p>
                    <input type={`text`} className={`px-5 py-3 rounded-lg mb-3 bg-white placeholder:text-gray-400 w-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-300`} placeholder={`john_doe31`} />
                    <p className={`text-lg mb-1`}>Password</p>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type={`password`} className={`px-5 py-3 rounded-lg mb-5 bg-white placeholder:text-gray-400 w-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-300`} placeholder={`•••••••••••`} />
                    <button onClick={registerUser} className={`bg-yellow-200 hover:opacity-80 mb-1.5 transition-all duration-200 ease-in-out px-4 py-2 rounded-lg text-lg cursor-pointer`}>Register</button>
                    <div className={`flex justify-between`}>
                        <p>Already Have an Account? <span onClick={() => navigate("/login", { replace: true })} className={`text-purple-800 cursor-pointer hover:opacity-70 transition-all duration-200 ease-in-out`}>Login</span></p>
                    </div>
                </div>
                <div className={`w-6/12 h-screen`}></div>
            </div>
        </div>
    );
}