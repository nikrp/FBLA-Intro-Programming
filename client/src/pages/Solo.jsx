import MessageComponent, { Message } from "./MessageComponent";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import image from './Intro_Scene_1.png';
import Timer from './Timer';
import { IoExitOutline } from "react-icons/io5";
import { HiPlay, HiPause } from "react-icons/hi2";
import { useLocation, useNavigate } from "react-router-dom";
import data from "./images";

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

    const navigate = useNavigate(); // Mpve between pages
    const location = useLocation(); // Contains Username passed From LandingPage.jsx

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

            console.log(data.sort((a, b) => a.id - b.id)[0].dialouge);
            setStory(data.sort((a, b) => a.id - b.id));
            setStoryline([data.sort((a, b) => a.id - b.id)[0]]);
            setOptionOneText(data.sort((a, b) => a.id - b.id)[0]);
            setOptionTwoText(data.sort((a, b) => a.id - b.id)[0]);

            // Begin the Stopwatch
            setIsPaused(false);
            setIsActive(true);
        }

        collectStory();
    }, []);

    function selectChoice(selected) {
        console.log("Selected:", selected);
        const next = story.find((val) => val.id === selected.id);
        setStoryline([...storyline, selected, next]);

        console.log(next);

        if (!next.option_1 && !next.option_2) {
            setAlive(false);
            handlePauseResume(); // Stop the Stopwatch

            if (next.dialouge[next.dialouge.length - 1].text === "The Good Ending.") {
                setSuccess(true);
                addTime();
            }
        }
        
        setOptionOneText(next);
        setOptionTwoText(next);

        console.log(next);
        console.log(data[next.id]);
    }

    async function addTime() {
        const { error } = await supabase.from("Times").insert({ username: location.state.username, seconds: time });

        if (error) {
            console.error("Error inserting data:", error);
        }
    }
    
    return (
        <div className={`max-h-screen h-screen flex w-screen`}>
            <div className={`w-1/2 bg-neutral-800`}>
                <div className={`h-[7%] bg-neutral-800 py-2 flex justify-between items-center gap-5 w-full px-2`}>
                    <button onClick={handlePauseResume} className={`bg-neutral-700 border border-neutral-600 hover:bg-neutral-700 hover:opacity-80 transition-all duration-200 ease-in-out cursor-pointer px-2 py-2 rounded-lg`}>
                        {isPaused ? <HiPlay size={20} fill="white" /> : <HiPause size={20} fill="white" />}
                    </button>
                    <p className={`font-semibold text-white`}><Timer time={time} /></p>
                    <button onClick={() => navigate('/', { replace: true })} className={`bg-red-400 border border-red-500 hover:bg-red-500 transition-all duration-200 ease-in-out cursor-pointer px-2 py-1 rounded-lg flex items-center gap-2.5`}>
                        <IoExitOutline size={20} color="white" />
                        <p className={`text-white`}>Leave</p>
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
                </div>
                <div className={`h-[17.5%] bg-neutral-800 py-2 flex justify-center items-center gap-10 w-full`}>
                    {alive ? (
                        <>
                            <div aria-readonly={isPaused} onClick={() => selectChoice({ type: "response", responseText: optionOneText.option_1_text, id: optionOneText.option_1 })} className={`hover:opacity-60 ${ isPaused && `blur-sm pointer-events-none` } bg-neutral-600 cursor-pointer transition-all duration-200 ease-in-out rounded-lg border-neutral-600 border-2 h-fit p-2 text-white drop-shadow-lg w-4/12`}>
                                <p>{optionOneText.option_1_text}</p>
                            </div>
                            <div aria-readonly={isPaused} onClick={() => selectChoice({ type: "response", responseText: optionTwoText.option_2_text, id: optionTwoText.option_2 })} className={`hover:opacity-60 ${ isPaused && `blur-sm pointer-events-none` } bg-neutral-600 cursor-pointer transition-all duration-200 ease-in-out rounded-lg border-neutral-600 border-2 h-fit p-2 text-white drop-shadow-lg w-4/12`}>
                                <p>{optionTwoText.option_2_text}</p>
                            </div>
                        </>
                    ) : success ? (
                        <p className={``}></p>
                    ) : (
                        <p className={`text-3xl font-bold text-red-500 capitalize`}>Uh oh, better luck next time!</p>
                    )}
                    
                </div>
            </div>
            <div className={`w-1/2 bg-neutral-800 ${alive ? `relative` : !success ? `bg-black` : ``} transition-all duration-500 ease-in`}>
                {alive ? (
                    <div>
                        <img className={`w-full h-screen transition-all duration-200 ease-in-out`} src={data[optionOneText.id] ? data[optionOneText.id].src : ``} alt={data[optionOneText.id]?.alt} />
                    </div>
                ) : success ? (
                    <img className={`w-full h-full`} src={data[24].src} alt={data[24].alt} />
                ) : (
                    <div className={`w-full h-full flex justify-center items-center flex-col relative`}>
                        <img className={`w-full h-screen transition-all duration-200 ease-in-out z-10`} src={data[optionOneText.id] ? data[optionOneText.id].src : ``} alt={data[optionOneText.id]?.alt} />
                        <motion.div initial={{ y: 0, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ease: "easeIn", duration: 1, delay: 0.15 }} className={`absolute z-20 p-5 rounded-lg bg-base-300 drop-shadow-sm flex flex-col justify-center`}>
                            <motion.p className={`mb-3 font-retro z-20 text-5xl font-extrabold px-4 py-2.5 pt-4 rounded-lg`}>GAME OVER</motion.p>
                            <button onClick={() => navigate('/', { replace: true })} className={`btn btn-error btn-lg`}>Return to Home</button>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}