import MessageComponent, { Message } from "./components/MessageComponent";
import Timer from './components/Timer';
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { IoExitOutline } from "react-icons/io5";
import { HiPlay, HiPause } from "react-icons/hi2";
import { useLocation, useNavigate } from "react-router-dom";
import data from "./images";
import { TbEdit } from "react-icons/tb";
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { IoShareSocialOutline, IoDownloadOutline } from "react-icons/io5";
import { jsPDF } from "jspdf";
import { PDFDocument, rgb } from 'pdf-lib';
import pdfTemplate from './assets/other/congratulations.pdf';
import fontr from './assets/other/retro.ttf';
import fontkit from '@pdf-lib/fontkit'

/**
 * The Solo mode page of the game. Basically Future-proofing for Multiplayer instead
 * of having the refactor everything if we were to add the feature.
 * @param {*} supabase - Supabase client that the page will use to communicate with the database.
 * @returns The Solo page.
 * @see MessageComponent - Component that displays the storyline.
 * @see Timer - Component that displays the stopwatch.
 * @see Message - Component that displays the options.
 * @see data - Array of objects that contains the storyline images.
 */
export default function Solo({ supabase }) {
    // State Variables
    const [storyline, setStoryline] = useState([]);
    const [optionOneText, setOptionOneText] = useState(undefined); // Option 1
    const [optionTwoText, setOptionTwoText] = useState(undefined); // Option 2
    const [optionNumber, setOptionNumber] = useState(0);
    const [story, setStory] = useState([]);
    const [alive, setAlive] = useState(true);
    const [success, setSuccess] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(true);
    const [time, setTime] = useState(0);
    const [deaths, setDeaths] = useState(0);
    const [optionsSelected, setOptionsSelected] = useState(0);
    const [rank, setRank] = useState(0);

    // Refrences
    const bottomRef = useRef(null);

    // Respawn Countdown
    const [showRespawnButton, setShowRespawnButton] = useState(false);
    const respawnTimer = 5000;
    const respawnTimerRef = useRef(respawnTimer);

    const navigate = useNavigate(); // Move between pages
    const location = useLocation(); // Contains Username passed From LandingPage.jsx

    // Player Prefrences
    const [colorChoice, setColorChoice] = useState("rgb(94.38%, 97.41%, 100%)");
    const [username, setUsername] = useState(location.state.username);
    const [editUsername, setEditUsername] = useState(false);
    const [usernameDup, setUsernameDup] = useState(false);
    const colorRef = useRef(null);

    // Checkpoint Variables
    const [lastCheckpoint, setLastCheckpoint] = useState({});
    const [halfwayIndex, setHalfwayIndex] = useState(0);
    const [checkpointSet, setCheckpointSet] = useState(false);

    /**
     * Scroll down automatically everytime more content is added the the storyline.
     */
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [storyline]);

    /**
     * Handle changes to the stopwatch.
     */
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

    /**
     * Pause and resume the stopwatch.
     */
    function handlePauseResume() {
        setIsPaused(!isPaused);
    }

    /**
     * Collect the entire story from supabase when the page loads and starts the storyline with the first choices.
     * @see collectStory() - Collects the story from supabase and sets the state variables.
     */
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

    /**
     * Get the rank of this users time once they win.
     * @returns The rank of the player if they would be added tot he leaderboards.
     */
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

    /**
     * Whenever a choice is selected, this method is called.
     * @param {*} selected - The choice that was selected. Checked for possible endings.
     */
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

                    respawnTimerRef.current -= 10;
                }, 10);
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
        setOptionNumber(Math.floor(Math.random() * 2));
        console.log(Math.floor(Math.random() * 2));
        setOptionOneText(next);
        setOptionTwoText(next);
    }

    /**
     * Reset all variables required and move the player back to the beginning or checkpoint.
     */
    function respawn() {
        setShowRespawnButton(false);
        
        if (checkpointSet) {
            handleCheckpointRespawn();
        }

        setStoryline([lastCheckpoint]);
        setOptionOneText(lastCheckpoint);
        setOptionTwoText(lastCheckpoint);
        setAlive(true);
        setDeaths((deaths) => deaths + 1);
        respawnTimerRef.current = 5000;
    }

    /**
     * Add the Player's Time to the Leaderboard including their Deaths, Username, and Color Choice
     */
    async function addTime() {
        // Insert New Record into Times Table
        const { error } = await supabase.from("Times_Real").insert({ username: username, seconds: time, deaths: deaths, color: colorChoice, options_selected: optionsSelected });

        if (error) { // Error while inserting data
            console.error("Error inserting data:", error);
        } else { // No error, update local best score through cookies.
            const currentUsername = Cookies.get('username');
            const currentTimeSeconds = Cookies.get('seconds');
            console.log("Current Username: " + currentUsername);
            console.log("Current Time: " + currentTimeSeconds);

            // Check if cookie already exists, otherwise just add new cookies.
            if (currentUsername) {
                // Check if new time is better than the time stored in cookies, only then updates info.
                console.log(currentTimeSeconds, parseInt(currentTimeSeconds), time)
                if (time < parseInt(currentTimeSeconds)) {
                    Cookies.set('username', username, { expires: 399 });
                    Cookies.set('seconds', time, { expires: 399 });
                    Cookies.set('deaths', deaths, { expires: 399 });
                    Cookies.set('color', colorChoice, { expires: 399 });
                    Cookies.set('options', optionsSelected, { expires: 399 });
                    console.log("Cookies Updated");
                }
            } else {
                Cookies.set('username', username, { expires: 399 });
                Cookies.set('seconds', time, { expires: 399 });
                Cookies.set('deaths', deaths, { expires: 399 });
                Cookies.set('color', colorChoice, { expires: 399 });
                Cookies.set('options', optionsSelected, { expires: 399 });
                console.log("Cookies Set");
            }

            // Return Home after Everything
            navigate('/', { replace: true });
        }
    }

    /**
     * Check if the edited username after winning is a duplicate.
     * @param {*} e - The event object containing the input value to check through supabase.
     */
    async function handleValidation(e) {
        const { data, error } = await supabase.from("Times_Real").select();
        if (!error) { // Only if there was no error with retrieving times.
            const dup = data.find((value) => value.username.trim() === e.target.value.trim());

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

    /**
     * Edit template PDF with user's run statistics.
     * @deprecated - Old method for modifying template PDF with stats. Not used
     * anymore due to old dependencies being replaced with easier alternatives.
     * @see loadTemplate() - New method for modifying template PDF with stats.
     */
    function downloadResults() {
        const doc = new jsPDF();

        // Header
        doc.setFont("helvetica", "normal");
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("Congratulations Player", 10, 20);
        doc.setFont("helvetica", "bold");
        doc.text(`${username}!`, 10, 30, { maxWidth: 180, align: 'left' });

        // Intro
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text("You have completed one of the many possibilities of The Grand Adventure!", 10, 45);

        // Section Header
        doc.setDrawColor(0);
        doc.line(10, 52, 200, 52); // horizontal line separator
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Your Results", 10, 60);

        // Stats
        doc.setFont("helvetica", "normal");
        doc.setFontSize(5);
        doc.setFillColor("#FFFFFF");
        const hours = Math.floor(time / (60 * 60 * 1000));
        const minutes = Math.floor((time % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((time % (60 * 1000)) / 1000);
        const milliseconds = time % 1000;
        doc.text(`• Time Taken:          ${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}.${("0" + milliseconds).slice(-2)}`, 10, 75);
        doc.text(`• Total Deaths:         ${deaths}`, 10, 85);
        doc.text(`• Rank Achieved:     ${rank}`, 10, 95);
        doc.text(`• Options Selected:  ${optionsSelected}`, 10, 105);

        // Save
        doc.save(`${username}_GrandAdventure_Stats_Report.pdf`);
    }

    // Load the template pdf from assets and add the users stats to it.
    const loadTemplate = async () => {
        
        // Load and prepare the PDF template and custom font for modification,
        // converting them to the right format and getting the first page ready
        const existingPdfBytes = await fetch(pdfTemplate).then(res => res.arrayBuffer());
        const fontBytes = await fetch(fontr).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        pdfDoc.registerFontkit(fontkit)
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        // Load the prepared font and set the global size for easier size changing in the future.
        const font = await pdfDoc.embedFont(fontBytes);
        const STAT_FONT_SIZE = 20

        // Draw the username bellow 'Congratulations' text, making calculations for center of PDF.
        const textWidth = font.widthOfTextAtSize(username, 28);
        firstPage.drawText(username, { x: 300 - textWidth / 2, y: 550, size: 28, font, color: rgb(0, 0, 1) });
        const hours = Math.floor(time / (60 * 60 * 1000));
        const minutes = Math.floor((time % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((time % (60 * 1000)) / 1000);
        const milliseconds = time % 1000;

        // Time Statistics
        const timeText = `${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}.${("0" + milliseconds).slice(-2)}`;
        const timeTextWidth = font.widthOfTextAtSize(timeText, STAT_FONT_SIZE);
        firstPage.drawText(timeText, { x: 500 - timeTextWidth, y: 420, size: STAT_FONT_SIZE, font, color: rgb(1, 1, 0) });
        
        // Death Statistics
        const deathsText = `${deaths}`;
        const deathsTextWidth = font.widthOfTextAtSize(deathsText, STAT_FONT_SIZE);
        firstPage.drawText(deathsText, { x: 500 - deathsTextWidth, y: 332.5, size: STAT_FONT_SIZE, font, color: rgb(1, 1, 0) });

        // Amount of options selected during run statistics.
        const optionsSelectedText = `${optionsSelected}`;
        const optionsSelectedTextWidth = font.widthOfTextAtSize(optionsSelectedText, STAT_FONT_SIZE);
        firstPage.drawText(optionsSelectedText, { x: 500 - optionsSelectedTextWidth, y: 245, size: STAT_FONT_SIZE, font, color: rgb(1, 1, 0) });

        // Global Rank Statistics
        const rankText = `${rank}`;
        const rankTextWidth = font.widthOfTextAtSize(rankText, STAT_FONT_SIZE);
        firstPage.drawText(rankText, { x: 500 - rankTextWidth, y: 160, size: STAT_FONT_SIZE, font, color: rgb(1, 1, 0) });

        // Save the modified PDF to a new variable.
        const modifiedPdfBytes = await pdfDoc.save();

        // Create a link to the PDF blob data.
        const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${username}_GrandAdventure_Stats_Report.pdf`; // Name of the Downloaded PDF

        // Click the link that we created and then detach it.
        link.click();
        URL.revokeObjectURL(url);
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
                        (() => {
                            const key1 = optionNumber === 0 ? ["option_1_text", "option_1"] : ["option_2_text", "option_2"];
                            const key2 = optionNumber === 0 ? ["option_2_text", "option_2"] : ["option_1_text", "option_1"];

                            return (
                                <React.Fragment>
                                    <div aria-readonly={isPaused} onClick={() => selectChoice({ type: "response", responseText: optionOneText[key1[0]], id: optionOneText[key1[1]] })} className={`hover:opacity-60 ${ isPaused && `blur-sm pointer-events-none` } bg-neutral-600 cursor-pointer transition-all duration-200 ease-in-out rounded-lg border-neutral-600 border-2 h-fit p-2 text-white drop-shadow-lg w-4/12`}>
                                        <p>{optionOneText[key1[0]]}</p>
                                    </div>
                                    {optionTwoText[key2[1]] !== null && ( // If Option 2 exists, show it.
                                        <div aria-readonly={isPaused} onClick={() => selectChoice({ type: "response", responseText: optionTwoText[key2[0]], id: optionTwoText[key2[1]] })} className={`hover:opacity-60 ${ isPaused && `blur-sm pointer-events-none` } bg-neutral-600 cursor-pointer transition-all duration-200 ease-in-out rounded-lg border-neutral-600 border-2 h-fit p-2 text-white drop-shadow-lg w-4/12`}>
                                            <p>{optionTwoText[key2[0]]}</p>
                                        </div>
                                    )}
                                </React.Fragment>
                            )
                        })()
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
                            <motion.div initial={{ y: 0, opacity: 0 }} animate={{ y: 0, opacity: 0.95 }} transition={{ ease: "linear", duration: 0.5 }} className={`z-20 p-5 relative drop-shadow-2xl rounded-lg bg-base-300 flex flex-col justify-center`}>
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
                                <div className={`flex items-center w-full gap-2.5`}>
                                    <button onClick={loadTemplate} className={`flex items-center gap-1.5 btn btn-error mt-10 btn-lg w-[49%]`}><IoDownloadOutline size={20} /> Download Results</button>
                                    <button disabled={usernameDup} onClick={() => {addTime()}} className={`btn btn-success btn-lg disabled:opacity-75 mt-10 w-[49%]`}>Return to Home</button>
                                </div>
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