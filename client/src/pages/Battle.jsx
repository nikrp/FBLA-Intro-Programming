import { useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client';
import { IoIosCheckmarkCircle } from "react-icons/io";
import MessageComponent, { Message } from "./components/MessageComponent";

export default function Battle() {
    const socket = useRef(null);
    const [startCountdown, setStartCountdown] = useState(5);
    const [found, setFound] = useState(false);
    const countdownIntervalRef = useRef(null);
    const isSearchingRef = useRef(true);
    const oppBottomRef = useRef(null);
    const myBottomRef = useRef(null);
    
    const storylinePath2 = [
        {
            dialogue: [
                {
                    author: "Narrator",
                    text: "You find yourself at the edge of a towering mountain. The path ahead looks treacherous. Will you attempt to climb it?"
                }
            ]
        },
        {
            type: "response",
            responseText: "Yes, I will climb the mountain.",
            id: 1
        },
        {
            dialogue: [
                {
                    author: "Narrator",
                    text: "The climb is difficult, but you manage to scale the first few hundred feet. You come to a narrow ledge."
                }
            ]
        },
        {
            type: "response",
            responseText: "Continue across the ledge.",
            id: 2
        },
        {
            dialogue: [
                {
                    author: "Narrator",
                    text: "The ledge becomes more precarious, but you press on. Suddenly, a snowstorm begins to roll in. Visibility drops."
                }
            ]
        },
        {
            type: "response",
            responseText: "Push through the storm.",
            id: 3
        },
        {
            dialogue: [
                {
                    author: "Narrator",
                    text: "You push through the storm and reach the summit. The view is breathtaking, but you've expended most of your energy."
                }
            ]
        },
        {
            type: "response",
            responseText: "Take a moment to rest at the summit.",
            id: 4
        },
        {
            dialogue: [
                {
                    author: "Narrator",
                    text: "You rest at the summit, feeling the cool mountain air. But now, it's time to descend."
                }
            ]
        },
        {
            type: "response",
            responseText: "Descend the mountain carefully.",
            id: 5
        },
        {
            dialogue: [
                {
                    author: "Narrator",
                    text: "You carefully make your way down the mountain, the storm subsiding as you reach the base. You've survived the climb."
                }
            ]
        }
    ];           

    useEffect(() => {
        socket.current = io("http://localhost:3000");

        socket.current.on('connect', () => {
            console.log("Connected to the server!");
        });

        socket.current.on('ready', (data) => {
            isSearchingRef.current = false;

            countdownIntervalRef.current = setInterval(() => {
                setStartCountdown(prev => {
                    const newCountdown = prev - 1;
                    if (newCountdown <= 0) {
                        clearInterval(countdownIntervalRef.current);
                        setFound(true);
                    }
                    return newCountdown;
                });
            }, 1000);
        });

        socket.current.on("message", (data) => {
            console.log(data);
        });

        socket.current.on('added', (jsonData) => {
            console.log("Recieved data from the server:", jsonData);
        });

        socket.current.on("disconnect", () => {
            console.log("Disconnected from the server");
        });

        return () => {
            socket.current.disconnect();
        }
    }, []);

    useEffect(() => {
        oppBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [storylinePath2]);

    function addChoice(dataToAdd) {
        socket.current.emit("add", dataToAdd);
    }

    return (
        <div className={`max-h-screen h-screen flex w-screen`}>
            <div className={`w-1/2 flex flex-col`}>
                <div className={`h-6/12 p-5 bg-blue-500`}>
                    <div className="skeleton h-full w-full rounded-4xl"></div>
                </div>
                <div className={`h-6/12 p-2 flex justify-center items-center`}>
                    <button onClick={() => {addChoice({name: 'author', text: "This is the message from the author. Going to other sockets in the room."})}} className={`btn btn-md btn-neutral`}>Send Data</button>
                </div>
            </div>
            <div className={`w-px bg-neutral-600`}></div>
            <div className={`w-1/2 flex flex-col`}>
                <div className={`h-6/12 p-5 bg-red-500`}>
                    <div className="skeleton h-full w-full rounded-4xl"></div>
                </div>
                <div className={`h-6/12`}>
                    <div className={`overflow-y-scroll p-5 max-h-[78.0%] flex flex-col gap-5`}>
                        {storylinePath2.map((section, index) => {
                            console.log(section);
                            return !section.type ? (
                                <MessageComponent type="prompt">
                                    {section.dialogue.map((message, index) => {
                                        return (
                                            <Message key={index} from={message.author} text={message.text} />
                                        )
                                    })}
                                </MessageComponent>
                            ) : (
                                <MessageComponent text={section.responseText} />
                            )
                        })}
                        
                        <div ref={oppBottomRef}></div>
                    </div>
                    <div className={`border-t-2 border-gray-500 flex justify-center gap-10 items-center p-5`}>
                        <button className={`bg-neutral-700 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ease-in-out hover:bg-neutral-600`}>Choice #1 Here</button>
                        <button className={`bg-neutral-700 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ease-in-out hover:bg-neutral-600`}>Choice #1 Here</button>
                    </div>
                </div>
            </div>
            {!found && (
                <div className={`top-0 left-0 fixed w-screen h-screen flex justify-center items-center backdrop-blur-xl`}>
                    {isSearchingRef.current ? (
                        <div className={`w-2/6 bg-gray-800 p-10 z-10 rounded-xl drop-shadow-2xl flex justify-center items-center flex-col gap-4`}>
                            <span className={`loading loading-infinity loading-xl`}></span>
                            <p className={`text-4xl font-extrabold animate-pulse`}>Searching for Players</p>
                            <p className={`text-3xl font-bold text-amber-400`}>Lobby: 1/2</p>
                        </div>
                    ) : (
                        <div className={`w-2/6 bg-gray-800 p-10 z-50 rounded-xl drop-shadow-2xl flex justify-center items-center flex-col gap-4`}>
                            <IoIosCheckmarkCircle className={`fill-accent`} size={100} />
                            <p className={`text-xl font-bold`}>Players Found! Starting In:</p>
                            <p className={`text-4xl font-extrabold`}>{startCountdown}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}