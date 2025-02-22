import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoHelpOutline } from "react-icons/io5";
import jungleBg from './assets/other/landing_bg.jpg';
import Timer from './components/Timer';
import howToPlayStep1 from './assets/other/howToPlayStep1.png';
import howToPlayStep2 from './assets/other/howToPlayStep2.png';
import appLogo from './assets/other/app-logo.png';
import Cookies from 'js-cookie';

export default function LandingPage({ supabase }) {
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [times, setTimes] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);

    const navigate = useNavigate();
    
    async function handlePlayButton() {
        const userResult = times.find((value) => value.username.trim() === username.trim());

        if (userResult) {
            console.error("Username already exists, please select another!");
            setUsernameError(true);
        } else {
            navigate("/adventure", { replace: true, state: { username: username } });
        }
    }

    useEffect(() => {
        // Retrieve all times every recorded.
        async function retrieveTimes() {
            const { data, error } = await supabase.from("Times").select();

            // Make sure to update values only if there is no error with retrieving data.
            if (data) {
                setTimes(data); // Add all times to the times variable.
                setLeaderboard(data.sort((a, b) => a.seconds - b.seconds).slice(0, 10)); // Add top 10 to the leaderboard.
            } else {
                console.error("Error fetching from Times table:", error);
            }
        }

        retrieveTimes();
    }, []);

    return (
        <div theme={`light`} className={`w-screen h-screen bg-neutral-800 px-10 py-10 flex justify-center items-center`}>
            <img className={`w-screen h-screen fixed top-0 left-0`} src={jungleBg} about={`jungle`} />
            {/* Header/Navbar */}
            {/* <div className={`flex items-center justify-between w-full mx-auto py-5 px-5 rounded-lg bg-gray-100`}>
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
            </div> */}

            {/* First Look */}
            <div className={`grid grid-cols-12 gap-5 w-screen p-10`}>
                <div className={`col-span-4 rounded-lg drop-shadow-sm flex flex-col gap-3`}>
                    <div className={`rounded-lg p-7 bg-base-300`}>
                        <p className={`text-2xl font-semibold`}>Best Statistics</p>
                        <div className={`w-full h-0.5 my-2.5 bg-neutral-500`}></div>
                        {Cookies.get("username") ? (
                            <>
                                <p style={{ color: Cookies.get('color') }} className={`w-full text-3xl font-semibold mb-5 text-center`}>{Cookies.get('username')}</p>
                                <p className={`flex items-center justify-between mb-3`}>
                                    <p className={`text-xl font-normal`}>Time</p>
                                    <p className={`text-xl font-medium text-accent`}><Timer time={parseInt(Cookies.get('seconds'))} /></p>
                                </p>
                                <p className={`flex items-center justify-between mb-3`}>
                                    <p className={`text-xl font-normal`}>Deaths</p>
                                    <p className={`text-xl font-medium text-warning`}>{Cookies.get('deaths')}</p>
                                </p>
                                <p className={`flex items-center justify-between`}>
                                    <p className={`text-xl font-normal`}>Options Selected</p>
                                    <p className={`text-xl font-medium text-error`}>{Cookies.get('options')}</p>
                                </p>
                            </>
                        ) : (
                            <p className={`text-lg text-secondary`}>Play an adventure to see it come here!</p>
                        )}
                    </div>
                </div>
                <div className={`col-span-4 rounded-lg drop-shadow-sm flex flex-col gap-3`}>
                    <img src={appLogo} className={`w-4/6 mx-auto h-auto`} alt='Logo' />
                    <input value={username} onChange={(e) => setUsername(e.target.value)} className={`w-full rounded-lg px-4 text-2xl py-2 focus:outline-none focus:ring-2 placeholder:text-gray-400 text-black focus:ring-offset-2 focus:ring-offset-transparent focus:ring-neutral-200 bg-white`} placeholder={`Username`} type={`text`} />
                    {usernameError && <p className={`text-red-500 text-xl bg-white py-1.5 px-2.5 rounded-lg drop-shadow-sm`}>Username already taken, please try another one!</p>}
                    <button onClick={handlePlayButton} className={`text-3xl rounded-lg bg-emerald-400 w-full px-4 py-2 cursor-pointer hover:bg-emerald-300 transition-all duraiton-200 ease-in-out`}>Play</button>
                    <button onClick={() => document.getElementById('how_to_play_modal').showModal()} data-tip={`How to Play`} className={`animate-bounce w-fit tooltip tooltip-right mt-2 rounded-full px-3 py-3 bg-emerald-400 cursor-pointer hover:bg-emerald-500 transition-all duration-200 ease-in-out`}>
                        <IoHelpOutline size={20} color={`white`} />
                    </button>
                </div>
                <div className='col-span-4 rounded-lg bg-base-300 drop-shadow-sm p-5'>
                    <p className={`text-2xl font-semibold mb-5`}>Global Leaderboard</p>

                    <div className={`flex flex-col gap-4`}>
                        {leaderboard.map((value, index) => {
                            return (
                                <div key={index} className={`flex items-center justify-between`}>
                                    <p style={{ color: value.color }} className={`text-xl font-semibold`}>{index + 1}. {value.username}</p>
                                    <p className={`text-accent text-xl font-bold`}><Timer time={value.seconds} /></p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <dialog id={`how_to_play_modal`} className={`modal`}>
                <div className={`modal-box w-6/12 max-w-5xl`}>
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg mb-3">Hello, welcome to The Grand Adventure, here's how to play!</h3>
                    <p className={`text-xl font-semibold`}>1. Read the Dialouge on the Left Side of the Screen</p>
                    <img src={howToPlayStep1} alt='step-1' className={`my-3 w-96 h-auto`} />
                    <p className={`text-xl font-semibold`}>2. Select What Option you Think has the Best Outcome</p>
                    <img src={howToPlayStep2} alt='step-2' className={`my-3 w-96 h-auto`} />
                    <p className={`text-xl font-semibold`}>3. Try to Reach the End in the Shortest Possible Amount of Time!</p>
                    <h3 className="font-bold text-lg mt-3">Good Luck Adventurer!</h3>
                </div>
            </dialog>
        </div>
    );
}