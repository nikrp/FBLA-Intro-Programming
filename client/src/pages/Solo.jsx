import MessageComponent, { Message } from "./MessageComponent";
import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js'
import { motion } from "framer-motion";
import ReactPlayer from 'react-player';
import video from './My_Movie.mp4';
import image from './Intro_Scene_1.png';

const supabase = createClient('https://ejmvozkmcwtzffqfctfs.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbXZvemttY3d0emZmcWZjdGZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwODgxNDYsImV4cCI6MjA1NDY2NDE0Nn0.IfKuBiTTKG64KkQay_C7yhKTMJOKpm8iDBxU8uLG92I')

export default function Solo() {
    const [storyline, setStoryline] = useState([]);
    const [optionOneText, setOptionOneText] = useState("");
    const [optionTwoText, setOptionTwoText] = useState("");
    const [story, setStory] = useState([]);
    const [alive, setAlive] = useState(true);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        async function collectStory() {
            const { data, error } = await supabase.from("Story").select();
            
            if (error) {
                console.error("Error collecting story for database:", error.message);
                return;
            }

            console.log(data.sort((a, b) => a.id - b.id)[0].dialouge);
            setStory(data.sort((a, b) => a.id - b.id));
            setStoryline([data.sort((a, b) => a.id - b.id)[0]]);
            setOptionOneText(data.sort((a, b) => a.id - b.id)[0]);
            setOptionTwoText(data.sort((a, b) => a.id - b.id)[0]);
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
            if (next.dialouge[next.dialouge.length - 1].text === "The Good Ending.") {
                setSuccess(true);
            }
        }
        setOptionOneText(next);
        setOptionTwoText(next);
    }
    
    return (
        <div className={`max-h-screen h-screen flex w-screen`}>
            <div className={`w-1/2 bg-neutral-800`}>
                <div className={`overflow-y-auto bg-neutral-800 h-[82.5%] w-full border-b-2 border-b-neutral-600 py-4 flex flex-col items-center gap-10`}>
                
                    {storyline.map((section, index) => {

                        console.log(section);

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
                            <div onClick={() => selectChoice({ type: "response", responseText: optionOneText.option_1_text, id: optionOneText.option_1 })} className={`hover:opacity-60 bg-neutral-600 cursor-pointer transition-all duration-200 ease-in-out rounded-lg border-neutral-600 border-2 h-fit p-2 text-white drop-shadow-lg w-4/12`}>
                                <p>{optionOneText.option_1_text}</p>
                            </div>
                            <div onClick={() => selectChoice({ type: "response", responseText: optionTwoText.option_2_text, id: optionTwoText.option_2 })} className={`hover:opacity-60 bg-neutral-600 cursor-pointer transition-all duration-200 ease-in-out rounded-lg border-neutral-600 border-2 h-fit p-2 text-white drop-shadow-lg w-4/12`}>
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
                        <img className={`w-screen h-screen fixed top-0 left-0`} src={image} alt="helicopter" />
                        <button className={`bg-yellow-200 px-4 py-2 text-lg font-retro fixed bottom-5 mx-auto cursor-pointer hover:opacity-75 transition-all duration-200 ease-in-out`}>Next</button>
                    </div>
                ) : success ? (
                    <img className={`w-full h-full`} src={`Something`} alt="Successful Ending - Boys Playing in Backyard" />
                ) : (
                    <div className={`w-full h-full flex justify-center items-center flex-col`}>
                        <motion.p initial={{ y: 0, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ease: "easeIn", duration: 1, delay: 0.25 }} className={`font-retro text-5xl font-extrabold text-white`}>GAME OVER</motion.p>
                        {/* <div className={`relative`}><ReactPlayer style={{ pointerEvents: "none" }} config={{ youtube: { playerVars: { showinfo: 1 } } }} url={video} playing={true} onEnded={() => alert("Video Has Ended, call a method.")} width={600} height={350}/></div> */}
                    </div>
                )}
            </div>
        </div>
    );
}

// https://www.youtube.com/watch?v=BZP1rYjoBgI - 30 Second Clip for Testing Purposes