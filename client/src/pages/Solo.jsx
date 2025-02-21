import MessageComponent, { Message } from "./MessageComponent";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Timer from './Timer';
import { IoExitOutline } from "react-icons/io5";
import { HiPlay, HiPause } from "react-icons/hi2";
import { useLocation, useNavigate } from "react-router-dom";
import data from "./images";
import { TbEdit } from "react-icons/tb";
import Cookies from 'js-cookie';

export default function Solo({ supabase }) {
    const [storyline, setStoryline] = useState([]);
    const [optionOneText, setOptionOneText] = useState("");
    const [optionTwoText, setOptionTwoText] = useState("");
    const [story, setStory] = useState([]);
    const [alive, setAlive] = useState(true);
    const [success, setSuccess] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(true);
    const [time, setTime] = useState(0);
    const [deaths, setDeaths] = useState(0);
    const [optionsSelected, setOptionsSelected] = useState(0);

    // Refrences
    const bottomRef = useRef(null);

    // Respawn Countdown
    const respawnTimer = 5000;
    const respawnTimerRef = useRef(respawnTimer);

    const navigate = useNavigate(); // Move between pages
    const location = useLocation(); // Contains Username passed From LandingPage.jsx

    // Player Prefrences
    const [colorChoice, setColorChoice] = useState("rgb(94.38%, 97.41%, 100%)");
    const [username, setUsername] = useState(location.state.username);
    const [editUsername, setEditUsername] = useState(false);
    const colorRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [storyline]);

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

    function handlePauseResume() {
        setIsPaused(!isPaused);
    }

    useEffect(() => {
        async function collectStory() {
            const { data, error } = await supabase.from("JungleStory").select();
            
            if (error) {
                console.error("Error collecting story for database:", error.message);
                return;
            }

            setStory(data.sort((a, b) => a.id - b.id));
            setStoryline([data.sort((a, b) => a.id - b.id)[0]]);
            setOptionOneText(data.sort((a, b) => a.id - b.id)[0]);
            setOptionTwoText(data.sort((a, b) => a.id - b.id)[0]);

            // Begin the Stopwatch
            setIsPaused(false);
            setIsActive(true);
        }

        async function retrieveTimes() {
            const { data, error } = await supabase.from("Times").select();

            // Make sure to update values only if there is no error with retrieving data.
            if (data) {
                setTimes(data); // Add all times to the times variable.
            } else {
                console.error("Error fetching from Times table:", error);
            }
        }

        collectStory();
        retrieveTimes();
    }, []);

    function selectChoice(selected) {
        const next = story.find((val) => val.id === selected.id);
        setStoryline([...storyline, selected, next]);
        setOptionsSelected((optionsSelected) => optionsSelected + 1);
        
        // Game Over or Win Occured
        if (!next.option_1 && !next.option_2) {
            setAlive(false);

            if (next.dialouge[next.dialouge.length - 1].text === "The Good Ending.") { // Win
                handlePauseResume(); // Stop the Stopwatch
                setSuccess(true);
            } else { // Game Over
                const intervalId = setInterval(() => {
                    // Respawn Timer is 0, reset player variables but keep timer counting.
                    if (respawnTimerRef.current <= 0) {
                        setStoryline([story[0]]);
                        setOptionOneText(story[0]);
                        setOptionTwoText(story[0]);
                        setAlive(true);
                        setDeaths((deaths) => deaths + 1);
                        respawnTimerRef.current = 5000;
                        clearInterval(intervalId);
                    }

                    respawnTimerRef.current -= 10;
                }, 10);
            }
        }
        
        setOptionOneText(next);
        setOptionTwoText(next);
    }

    // Add the Player's Time to the Leaderboard including their Deaths, Username, and Color Choice
    async function addTime() {
        const { error } = await supabase.from("Times").insert({ username: location.state.username, seconds: time, deaths: deaths, color: colorChoice, options_selected: optionsSelected });

        if (error) {
            console.error("Error inserting data:", error);
        } else {
            const currentUsername = Cookies.get('username');
            const currentTimeSeconds = Cookies.get('seconds');

            if (currentUsername) {
                if (time < parseInt(currentTimeSeconds)) {
                    Cookies.set('username', username);
                    Cookies.set('seconds', time);
                    Cookies.set('deaths', deaths);
                    Cookies.set('color', colorChoice);
                    Cookies.set('options', optionsSelected);
                }
            } else {
                Cookies.set('username', username);
                Cookies.set('seconds', time);
                Cookies.set('deaths', deaths);
                Cookies.set('color', colorChoice);
                Cookies.set('options', optionsSelected);
            }
        }
    }
    
    return (
        <div className={`max-h-screen h-screen flex w-screen`}>
            <div className={`w-1/2 bg-neutral-800`}>
                <div className={`h-[7%] bg-neutral-800 py-2 flex justify-between items-center gap-5 w-full px-2`}>
                    <button disabled={!alive} onClick={handlePauseResume} className={`bg-neutral-700 border border-neutral-600 disabled:pointer-events-none hover:bg-neutral-700 hover:opacity-80 transition-all duration-200 ease-in-out cursor-pointer px-2 py-2 rounded-lg`}>
                        {isPaused ? <HiPlay size={20} fill="white" /> : <HiPause size={20} fill="white" />}
                    </button>
                    <p className={`font-semibold text-white`}><Timer time={time} /></p>
                    <button disabled={!alive} onClick={() => navigate('/', { replace: true })} className={`bg-red-400 border disabled:pointer-events-none border-red-500 hover:bg-red-500 transition-all duration-200 ease-in-out cursor-pointer px-2 py-1 rounded-lg flex items-center gap-2.5`}>
                        <IoExitOutline size={20} color="white" />
                        <p className={`text-white`}>Stop</p>
                    </button>
                </div>
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
                <div className={`h-[17.5%] bg-neutral-800 py-2 flex justify-center items-center gap-10 w-full`}>
                    {alive && (
                        <>
                            <div aria-readonly={isPaused} onClick={() => selectChoice({ type: "response", responseText: optionOneText.option_1_text, id: optionOneText.option_1 })} className={`hover:opacity-60 ${ isPaused && `blur-sm pointer-events-none` } bg-neutral-600 cursor-pointer transition-all duration-200 ease-in-out rounded-lg border-neutral-600 border-2 h-fit p-2 text-white drop-shadow-lg w-4/12`}>
                                <p>{optionOneText.option_1_text}</p>
                            </div>
                            <div aria-readonly={isPaused} onClick={() => selectChoice({ type: "response", responseText: optionTwoText.option_2_text, id: optionTwoText.option_2 })} className={`hover:opacity-60 ${ isPaused && `blur-sm pointer-events-none` } bg-neutral-600 cursor-pointer transition-all duration-200 ease-in-out rounded-lg border-neutral-600 border-2 h-fit p-2 text-white drop-shadow-lg w-4/12`}>
                                <p>{optionTwoText.option_2_text}</p>
                            </div>
                        </>
                    )}
                    
                </div>
            </div>
            <div className={`w-1/2 bg-neutral-800 ${alive ? `relative` : !success ? `bg-black` : ``} transition-all duration-500 ease-in`}>
                {alive ? (
                    <div>
                        <img className={`w-full h-screen transition-all duration-200 ease-in-out`} src={data[optionOneText.id] ? data[optionOneText.id].src : ``} alt={data[optionOneText.id]?.alt} />
                    </div>
                ) : success ? (
                    <div className={`w-full h-full flex justify-center items-center flex-col`}>
                        <img className={`w-full h-screen transition-all duration-200 ease-in-out z-10`} src={data[24].src} alt={data[24].alt} />
                        <div className={`w-screen h-screen backdrop-blur-xs z-100 fixed top-0 left-0 flex justify-center items-center`}>
                            <motion.div initial={{ y: 0, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ease: "linear", duration: 0.5 }} className={`z-20 p-5 drop-shadow-2xl rounded-lg bg-base-300 flex flex-col justify-center`}>
                                <motion.p className={`mb-7 font-retro z-20 text-4xl font-extrabold px-4 py-2.5 pt-4 rounded-lg text-success`}>Congratulations!</motion.p>
                                <div className={`flex gap-2.5 w-4/6 mx-auto items-center max-h-11 h-11 mb-5`}>
                                    <div onClick={() => colorRef.current.click()} className={`p-[7px] border hover:bg-base-100 border-neutral-600 btn btn-square flex relative`}>
                                        <div style={{ backgroundColor: colorChoice }} className={`w-full h-full rounded-sm mx-auto cursor-pointer`}></div>
                                        <input type="color" ref={colorRef} className={`opacity-0 absolute cursor-pointer`} onChange={(e) => setColorChoice(e.target.value)} />
                                    </div>
                                    <input className={`input focus:outline-none focus:border-neutral-600 input-lg w-full h-full font-semibold text-xl`} style={{ color: colorChoice }} value={username} onChange={(e) => setUsername(e.target.value)} readOnly={!editUsername} />
                                    <button className={`btn btn-square border-neutral-600`}><TbEdit size={20} color="white" className={``} /></button>
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
                                <button onClick={() => {addTime(); navigate('/', { replace: true })}} className={`btn btn-success btn-lg mt-10`}>Return to Home</button>
                            </motion.div>
                        </div>
                    </div>
                ) : (
                    <div className={`w-full h-full flex justify-center items-center flex-col relative`}>
                        <img className={`w-full h-screen transition-all duration-200 ease-in-out z-10`} src={data[optionOneText.id] ? data[optionOneText.id].src : ``} alt={data[optionOneText.id]?.alt} />
                        <motion.div initial={{ y: 0, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ease: "linear", duration: 0.5 }} className={`absolute z-20 p-5 rounded-lg bg-base-300 drop-shadow-sm flex flex-col justify-center`}>
                            <motion.p className={`mb-3 font-retro z-20 text-5xl font-extrabold px-4 py-2.5 pt-4 rounded-lg`}>GAME OVER</motion.p>
                            <p className={`text-2xl mb-3 font-semibold flex gap-1.5 mx-auto`}>Respawning In: <span className={`text-red-400`}><Timer time={respawnTimerRef.current} /></span></p>
                            <button onClick={() => navigate('/', { replace: true })} className={`btn btn-error btn-lg`}>Return to Home</button>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}