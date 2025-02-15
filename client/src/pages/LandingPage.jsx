export default function LandingPage() {
    return (
        <div className={`w-screen h-screen bg-purple-200 px-10 py-10`}>
            {/* Header/Navbar */}
            <div className={`flex items-center justify-between w-full mx-auto py-5 px-5 rounded-lg bg-gray-100`}>
                <p className={`text-xl font-bold`}>Storied</p>
                <div className={`flex gap-5`}>
                <p>Home</p>
                <p>About Us</p>
                <p>Get Started</p>
                <p>Features</p>
                <p>Contact</p>
                </div>
                <div className={`flex gap-3`}>
                <button className={`bg-purple-200 px-3 py-1.5 rounded-md border border-purple-200 cursor-pointer hover:bg-purple-300 hover:border-purple-300 transition-all duration-200 ease-in-out`}>Login</button>
                <button className={`px-3 py-1.5 rounded-md border border-purple-200 cursor-pointer hover:border-purple-300 hover:bg-purple-300 transition-all duration-200 ease-in-out`}>Register</button>
                </div>
            </div>

            {/* First Look */}
            <div className={`flex justify-between mt-32 gap-30`}>
                <div className={`p-10 border-2 border-black bg-purple-300 bg-opacity-80 rounded-4xl max-w-72 transition-all duration-300 ease-in-out relative flex justify-center grow`}>
                <div className={`bg-black px-3.5 py-2.5 text-xl font-semibold w-fit rounded-full text-white absolute -inset-y-6 h-fit `}>#1</div>
                <div className={``}>
                    <p className={`text-lg text-center`}>Interactive Storymode Game by <span className={`font-semibold`}>Storied</span></p>
                </div>
                </div>
                <div className={`p-10 border-2 border-black bg-yellow-300 rounded-4xl max-w-64 scale-125 transition-all duration-300 ease-in-out grow relative`}>
                <div className={`relative group mt-8 h-16`}>
                    <button className={`absolute px-4 py-2 rounded-lg border-2 border-black bg-white text-black w-full rotate-3 z-20 group-hover:bg-gray-200 transition-all duration-200 ease-in-out cursor-pointer`}>Begin Today →</button>
                    <button className={`absolute border-2 border-gray-400 bg-gray-400 text-gray-400 opacity-35 w-full rotate-6 rounded-lg px-4 py-2 z-10 mt-3 group-hover:mt-1.5 group-hover:rotate-3 transition-all duration-200 ease-in-out cursor-pointer`}>Begin Today →</button>
                </div>
                </div>
                <div className={`p-10 border-2 border-black bg-purple-300 bg-opacity-80 rounded-4xl max-w-72 transition-all duration-300 ease-in-out relative flex justify-center grow`}>
                <div className={`bg-black px-3 py-3 text-xl font-semibold w-fit rounded-full text-white absolute -inset-y-6 h-fit`}>⭐</div>
                <div className={`mx-auto w-fit`}>
                    <p className={`text-5xl font-semibold text-center mb-2.5`}>4.9</p>
                    <p className={`text-lg w-fit text-center`}>Satisfied users <span className={`font-semibold`}>Worldwide</span></p>
                </div>
                </div>
            </div>
        </div>
    );
}