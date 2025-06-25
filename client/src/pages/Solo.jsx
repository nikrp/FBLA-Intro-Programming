import MessageComponent, { Message } from "./components/MessageComponent";
import Timer from './components/Timer';
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { IoExitOutline } from "react-icons/io5";
import { HiPlay, HiPause } from "react-icons/hi2";
import { useLocation, useNavigate } from "react-router-dom";
import data from "./images";
import { TbEdit } from "react-icons/tb";
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';

export default function Solo({ supabase }) {
    // Story & Choices
    const [storyline, setStoryline] = useState([]);
    const [optionOneText, setOptionOneText] = useState(undefined); // Option 1
    const [optionTwoText, setOptionTwoText] = useState(undefined); // Option 2
    const [optionsSelected, setOptionsSelected] = useState(0);
    const [story, setStory] = useState([]);

    // Player State
    const [alive, setAlive] = useState(true);
    const [success, setSuccess] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(true);

    // Statistics
    const [time, setTime] = useState(0);
    const [deaths, setDeaths] = useState(0);
    const [rank, setRank] = useState(0);

    // Refrences
    const bottomRef = useRef(null);

    // Respawn Countdown
    const [showRespawnButton, setShowRespawnButton] = useState(false);
    const respawnTimer = 3000;
    const respawnTimerRef = useRef(respawnTimer);

    // React Router Navigation
    const navigate = useNavigate(); // Navigate
    const location = useLocation(); // Object containing username from LandingPage.jsx

    // Player Preferences
    const [colorChoice, setColorChoice] = useState("rgb(94.38%, 97.41%, 100%)");
    const [username, setUsername] = useState(location.state.username);
    const [editUsername, setEditUsername] = useState(false);
    const [usernameDup, setUsernameDup] = useState(false);
    const colorRef = useRef(null);

    // Checkpoint Variables
    const [lastCheckpoint, setLastCheckpoint] = useState({});
    const [halfwayIndex, setHalfwayIndex] = useState(0);
    const [checkpointSet, setCheckpointSet] = useState(false);

    // Scroll down automatically everytime more content is added the the storyline.
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [storyline]);

    // Handle changes to the stopwatch.
    useEffect(() => {
        let interval = null;

        if (isActive && !isPaused) {
            interval = setInterval(() => {
                setTime((time) => time + 10);
            }, 10);
        } else {
            clearInterval(interval);
        }

        return () => {
            clearInterval(interval);
        }
    }, [isActive, isPaused]);

    // Pause the stopwatch.
    function handlePauseResume() {
        setIsPaused(!isPaused);
    }

    // Collect the entire story from supabase when the page loads and starts the storyline with the first choices.
    useEffect(() => {
        async function collectStory() {
            const { data, error } = await supabase.from("JungleStory").select();
            
            if (error) {
                console.error("Error collecting story for database:", error.message);
                return;
            }

            // Update Variabled to Begin the Story
            setStory(data.sort((a, b) => a.id - b.id));
            setStoryline([data.sort((a, b) => a.id - b.id)[0]]);
            setOptionOneText(data.sort((a, b) => a.id - b.id)[0]);
            setOptionTwoText(data.sort((a, b) => a.id - b.id)[0]);

            // Set Checkpoint to the Start for Now
            setLastCheckpoint(data.sort((a, b) => a.id - b.id)[0]);
            setHalfwayIndex(Math.floor(data.sort((a, b) => a.id - b.id).length / 4));

            // Begin the Stopwatch
            setIsPaused(false);
            setIsActive(true);
        }

        collectStory();
    }, []);

    // Get the rank of this users time once they win.
    async function getPlayerRank() {
        const { data, error } = await supabase.from("Times_Real").select();

        if (error) {
            console.error("Error fetching times:", error);
            return null;
        }

        // Make a Copy of Data to preserve the Original if it's needed
        const sortedRanks = [...data].sort((a, b) => a.seconds - b.seconds);

        // Find what the players rank would be. rank variable could be updated, so no constant used.
        // Add one if they are indexes.
        let rank = sortedRanks.findIndex(player => time < player.seconds) + 1;

        // If the new score is the worst in the array, findIndex will return -1.
        // The +1 at the end though will make it 0.
        if (rank === 0) {
            rank = sortedRanks.length + 1;
        }

        console.log(rank);

        // Update rank state variable with the calculated value,
        setRank(rank)
    }

    // Whenever a choice is selected, this method is called.
    function selectChoice(selected) {
        const next = story.find((val) => val.id === selected.id);
        const newStoryLine = [...storyline, selected, next];
        setStoryline(newStoryLine);
        setOptionsSelected((optionsSelected) => optionsSelected + 1);
        
        // Game Over or Win Occured
        if (!next.option_1 && !next.option_2) {
            setAlive(false);

            if (next.dialouge[next.dialouge.length - 1].text === "The Good Ending.") { // Win
                handlePauseResume(); // Stop the Stopwatch
                getPlayerRank(); // Call getPlayerRank() to calculate the player's position.
                setSuccess(true);
            } else { // Game Over
                const intervalId = setInterval(() => {
                    // Respawn Timer is 0, show the respawn button.
                    if (respawnTimerRef.current <= 0) {
                        setShowRespawnButton(true);
                        clearInterval(intervalId);
                    }

                    respawnTimerRef.current -= 20;
                }, 5);
            }
        } else {
            // Update the Checkpoint if halfwayIndex is met
            if (!checkpointSet && newStoryLine.length >= halfwayIndex) {
                setLastCheckpoint(next);
                setCheckpointSet(true);
                handleCheckpointSet();
            }
        }
        
        // Update the possible options.
        setOptionOneText(next);
        setOptionTwoText(next);
    }

    // Reset all variables required and move the player back to the beginning or checkpoint.
    function respawn() {
        setShowRespawnButton(false);
        

        if (checkpointSet) {
            handleCheckpointRespawn();

            // Include the previous choice and checkpoint dialogue in the storyline
            const previousChoice = storyline[storyline.length - 2];

            if (previousChoice) {
                setStoryline([previousChoice, lastCheckpoint]); // Add both the previous choice and checkpoint to the storyline
            } else {
                setStoryline([lastCheckpoint]); // If no previous choice exists, just add the checkpoint
            }
        } else {
            setStoryline([lastCheckpoint]); // Default behavior if no checkpoint is set
        }

        setOptionOneText(lastCheckpoint);
        setOptionTwoText(lastCheckpoint);
        setAlive(true);
        setDeaths((deaths) => deaths + 1);
        respawnTimerRef.current = 3000;
    }

    // Add the Player's Time to the Leaderboard including their Deaths, Username, and Color Choice
    async function addTime() {
        // Insert New Record into Times Table
        const { error } = await supabase.from("Times_Real").insert({ username: username, seconds: time, deaths: deaths, color: colorChoice, options_selected: optionsSelected });

        if (error) { // Error while inserting data
            console.error("Error inserting data:", error);
        } else { // No error, update local best score through cookies.
            const currentUsername = Cookies.get('username');
            const currentTimeSeconds = Cookies.get('seconds');

            // Check if cookie already exists, otherwise just add new cookies.
            if (currentUsername) {
                // Check if new time is better than the time stored in cookies, only then updates info.
                if (time < parseInt(currentTimeSeconds)) {
                    Cookies.set('username', username, { expires: 399 });
                    Cookies.set('seconds', time, { expires: 399 });
                    Cookies.set('deaths', deaths, { expires: 399 });
                    Cookies.set('color', colorChoice, { expires: 399 });
                    Cookies.set('options', optionsSelected, { expires: 399 });
                }
            } else {
                Cookies.set('username', username, { expires: 399 });
                Cookies.set('seconds', time, { expires: 399 });
                Cookies.set('deaths', deaths, { expires: 399 });
                Cookies.set('color', colorChoice, { expires: 399 });
                Cookies.set('options', optionsSelected, { expires: 399 });
            }

            // Return Home after Everything
            navigate('/', { replace: true });
        }
    }

    // Check if the edited username after winning is a duplicate.
    async function handleValidation(e) {
        const { data, error } = await supabase.from("Times_Real").select();
        if (!error) { // Only if there was no error with retrieving times.
            const dup = data.find((value) => value.username.trim() === e.target.value.trim());

            for (const u of data) {
                console.log(u.username.trim(), e.target.value.trim(), u.username.trim() === e.target.value.trim());
            }

            console.log(data, dup);

            if (dup) {
                e.target.setCustomValidity("Username already taken, please try another one!");
                setUsernameDup(true);
            } else if (e.target.value.trim().length === 0) {
                e.target.setCustomValidity("Username can't be blank, put something!");
                setUsernameDup(true);
            } else {
                e.target.setCustomValidity("");
                setUsernameDup(false);
            }
        }
    }

    // Call a toast for setting a checkpoint.
    function handleCheckpointSet() {
        toast("Checkpoint Set!");
    }

    // Call a toast for respawing at a checkpoint.
    function handleCheckpointRespawn() {
        toast("Respawned at Checkpoint!");
    }
    
    return (
        <div className={`max-h-screen h-screen flex w-screen`}>
            {/* Split screen into two halves. This is the first half. */}
            <div className={`w-1/2 bg-neutral-800`}>
                {/* Top Header */}
                <div className={`h-[7%] bg-neutral-800 py-2 flex justify-between items-center gap-5 w-full px-2`}>
                    <button onClick={handlePauseResume} className={`bg-neutral-700 border border-neutral-600 hover:bg-neutral-700 hover:opacity-80 transition-all duration-200 ease-in-out cursor-pointer px-2 py-2 rounded-lg`}>
                        {isPaused ? <HiPlay size={20} fill="white" /> : <HiPause size={20} fill="white" />}
                    </button>
                    <p className={`font-semibold text-white`}><Timer time={time} /></p>
                    <button onClick={() => navigate('/', { replace: true })} className={`bg-red-400 border border-red-500 hover:bg-red-500 transition-all duration-200 ease-in-out cursor-pointer px-2 py-1 rounded-lg flex items-center gap-2.5`}>
                        <IoExitOutline size={20} color="white" />
                        <p className={`text-white`}>Stop</p>
                    </button>
                </div>

                {/* Show Dialouge and Answers */}
                <div className={`overflow-y-auto bg-neutral-800 h-[75.5%] w-full border-b-2 border-b-neutral-600 py-4 flex flex-col items-center gap-10`}>
                    {storyline.map((section, index) => {
                        return !section.type ? (
                            <MessageComponent type="prompt">
                                {section.dialouge.map((message, index) => {
                                    return (
                                        <Message key={index} from={message.from} text={message.text} />
                                    )
                                })}
                            </MessageComponent>
                        ) : (
                            <MessageComponent text={section.responseText} />
                        )
                    })}

                    <div ref={bottomRef}></div>
                </div>

                {/* Show Response Options (Only if Alive) */}
                <div className={`h-[17.5%] bg-neutral-800 py-2 flex justify-center items-center gap-10 w-full`}>
                    {alive && optionOneText && optionTwoText && (
                        <>
                            <div aria-readonly={isPaused} onClick={() => selectChoice({ type: "response", responseText: optionOneText.option_1_text, id: optionOneText.option_1 })} className={`hover:opacity-60 ${ isPaused && `blur-sm pointer-events-none` } bg-neutral-600 cursor-pointer transition-all duration-200 ease-in-out rounded-lg border-neutral-600 border-2 h-fit p-2 text-white drop-shadow-lg w-4/12`}>
                                <p>{optionOneText.option_1_text}</p>
                            </div>
                            {optionTwoText.option_2 !== null && ( // If Option 2 exists, show it.
                                <div aria-readonly={isPaused} onClick={() => selectChoice({ type: "response", responseText: optionTwoText.option_2_text, id: optionTwoText.option_2 })} className={`hover:opacity-60 ${ isPaused && `blur-sm pointer-events-none` } bg-neutral-600 cursor-pointer transition-all duration-200 ease-in-out rounded-lg border-neutral-600 border-2 h-fit p-2 text-white drop-shadow-lg w-4/12`}>
                                    <p>{optionTwoText.option_2_text}</p>
                                </div>
                            )}
                            
                        </>
                    )}
                    
                </div>
            </div>

            {/* 
                If alive, show corresponding images to the situation.
                If not alive, but a succesful ending was reached, blur background and show congratulations with stats.
                If not alive and a death was shown, display a countdown timer for respawning and a go back home button to leave.
            */}
            <div className={`w-1/2 bg-neutral-800 ${alive ? `relative` : !success ? `bg-black` : ``} transition-all duration-500 ease-in`}>
                {alive && optionOneText ? (
                    <div>
                        <img className={`w-full h-screen transition-all duration-200 ease-in-out`} src={data[optionOneText.id] ? data[optionOneText.id].src : ``} alt={data[optionOneText.id]?.alt} />
                    </div>
                ) : success ? (
                    <div className={`w-full h-full flex justify-center items-center flex-col`}>
                        {/* Final Image */}
                        <img className={`w-full h-screen transition-all duration-200 ease-in-out z-10`} src={data[24].src} alt={data[24].alt} />

                        {/* Congratulations Modal */}
                        <div className={`w-screen h-screen z-100 fixed top-0 left-91 flex justify-center items-center`}>
                            <motion.div initial={{ y: 0, opacity: 0 }} animate={{ y: 0, opacity: 0.95 }} transition={{ ease: "linear", duration: 0.5 }} className={`z-20 p-5 drop-shadow-2xl rounded-lg bg-base-300 flex flex-col justify-center`}>
                                <motion.p className={`mb-7 font-retro z-20 text-4xl font-extrabold px-4 py-2.5 pt-4 rounded-lg text-success`}>Congratulations!</motion.p>
                                <div className={`flex gap-2.5 mx-auto items-start w-fit h-20 mb-5`}>
                                    <div onClick={() => colorRef.current.click()} className={`p-[7px] border hover:bg-base-100 border-neutral-600 btn btn-square flex relative`}>
                                        <div style={{ backgroundColor: colorChoice }} className={`w-full h-full rounded-sm mx-auto cursor-pointer`}></div>
                                        <input type="color" ref={colorRef} className={`opacity-0 absolute cursor-pointer`} onChange={(e) => setColorChoice(e.target.value)} />
                                    </div>
                                    <div>
                                        <input onInput={handleValidation} className={`input validator read-only:border-neutral-700 focus:outline-none focus:border-neutral-500 input-lg w-full font-semibold text-xl`} style={{ color: colorChoice }} value={username} onChange={(e) => setUsername(e.target.value)} readOnly={!editUsername} />
                                        <div className="validator-hint">Username has been taken already. Username can't be blank.</div>
                                    </div>
                                    <button onClick={() => setEditUsername(!editUsername)} data-tip={`Press Again to Stop Edit`} className={`${editUsername && `tooltip tooltip-top tooltip-open`} btn btn-square border-neutral-600 relative flex justify-center items-center`}><TbEdit size={20} color="white" className={`${editUsername && `absolute`}`} /></button>
                                </div>
                                <div className={`flex justify-between items-center mb-5`}>
                                    <p className={`text-2xl font-semibold`}>Final Time</p>
                                    <p className={`text-2xl text-accent font-bold`}><Timer time={time} /></p>
                                </div>
                                <div className={`flex justify-between items-center mb-5`}>
                                    <p className={`text-2xl font-semibold`}>Deaths</p>
                                    <p className={`text-2xl text-warning font-bold`}>{deaths}</p>
                                </div>
                                <div className={`flex justify-between items-center`}>
                                    <p className={`text-2xl font-semibold`}>Options Selected</p>
                                    <p className={`text-2xl text-error font-bold`}>{optionsSelected}</p>
                                </div>
                                <p className={`w-full text-center text-2xl font-semibold text-secondary`}>Rank: {rank}</p>
                                <button disabled={usernameDup} onClick={() => {addTime()}} className={`btn btn-success btn-lg disabled:opacity-75 mt-10`}>Return to Home</button>
                            </motion.div>
                        </div>
                    </div>
                ) : !alive && (
                    <div className={`w-full h-full flex justify-center items-center flex-col relative`}>
                        {/* Show Image Relating to the End */}
                        {optionOneText && <img className={`w-full h-screen transition-all duration-200 ease-in-out z-10`} src={data[optionOneText.id] ? data[optionOneText.id].src : ``} alt={data[optionOneText.id]?.alt} />}

                        {/* Game Over Modal */}
                        <motion.div initial={{ y: 0, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ease: "linear", duration: 0.5 }} className={`absolute z-20 p-5 rounded-lg bg-base-300 drop-shadow-sm flex flex-col justify-center`}>
                            <motion.p className={`mb-3 font-retro z-20 text-5xl font-extrabold px-4 py-2.5 pt-4 rounded-lg`}>GAME OVER</motion.p>
                            <p className={`text-2xl mb-3 font-semibold flex gap-1.5 mx-auto`}>Respawning In:
                                {showRespawnButton ? (
                                    <span className={`text-green-400`}>00:00:00</span>
                                ) : (
                                    <span className={`text-red-400`}><Timer time={respawnTimerRef.current} /></span>
                                )}
                            </p>
                            <div className={`w-full flex items-center justify-between`}>
                                <button onClick={() => navigate('/', { replace: true })} className={`btn btn-error btn-lg ${showRespawnButton ? `w-[48%]` : `w-full`}`}>Return to Home</button>

                                {/* Only show the respawn button if the countdown has ended. */}
                                {showRespawnButton && <button onClick={respawn} className={`btn btn-success btn-lg w-[48%]`}>Respawn!</button>}
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
            <ToastContainer theme={`dark`} />
        </div>
    );
}