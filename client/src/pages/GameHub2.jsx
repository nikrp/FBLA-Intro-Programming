import { RiUser3Fill } from "react-icons/ri";
import { IoIosCreate } from "react-icons/io";
import { TbSwords } from "react-icons/tb";

export default function GameHub2() {
    return (
        <div className={`min-h-screen w-screen bg-neutral-900 flex`}>
            <div className={`my-5 ml-5 max-h-screen drop-shadow-lg rounded-lg bg-neutral-800 w-2/12`}></div>
            <div className={`h-screen w-9/12 ml-14 py-5 grid grid-cols-12 grid-rows 3 gap-5`}>
                <div className={`hover:scale-105 cursor-pointer transition-all duration-200 ease-in-out hover:opacity-80 col-span-4 rounded-lg p-5 bg-neutral-800 h-fit flex flex-col justify-center items-center`}>
                    <RiUser3Fill fill={`white`} size={60} />
                    <p className={`text-3xl font-normal text-white mt-1.5`}>Solo Adventure</p>
                </div>
                <div className={`hover:scale-105 cursor-pointer transition-all duration-200 ease-in-out hover:opacity-80 col-span-4 rounded-lg p-5 bg-neutral-800 h-fit flex flex-col justify-center items-center`}>
                    <TbSwords color={`white`} size={60} />
                    <p className={`text-3xl font-normal text-white mt-1.5`}>1v1 Adventure</p>
                </div>
                <div className={`hover:scale-105 cursor-pointer transition-all duration-200 ease-in-out hover:opacity-80 col-span-4 rounded-lg p-5 bg-neutral-800 h-fit flex flex-col justify-center items-center`}>
                    <IoIosCreate fill={`white`} size={60} />
                    <p className={`text-3xl font-normal text-white mt-1.5`}>Make an Adventure</p>
                </div>
                <div className={`col-span-6 rounded-lg p-5 bg-neutral-800 h-fit`}>
                    <p className={`text-2xl font-semibold text-white mb-5 p-0`}>Adventure Activity</p>
                    <div className={`grid grid-cols-6 grid-rows-3 gap-5`}>
                        <div className={`bg-neutral-700 p-2 rounded-lg drop-shadow-sm col-span-2`}>
                            <p className={`text-sm text-gray-300`}>Adventures Played</p>
                            <p className={`text-lg text-white font-medium`}>137</p>
                            <p className={`text-green-400 text-sm`}>+12 This Week</p>
                        </div>
                        <div className={`col-span-4 row-span-2 bg-neutral-700 drop-shadow-sm p-2 rounded-lg`}>
                            <p className={`text-xl font-medium text-white`}>Daily Digest</p>
                        </div>
                        <div className={`bg-neutral-700 p-2 rounded-lg drop-shadow-sm col-span-2`}>
                            <p className={`text-sm text-gray-300`}>Points Earned</p>
                            <p className={`text-lg text-white font-medium`}>3,982</p>
                            <p className={`text-green-400 text-sm`}>+385 This Week</p>
                        </div>
                        <div className={`bg-neutral-700 p-2 rounded-lg drop-shadow-sm col-span-2`}>
                            <p className={`text-sm text-gray-300`}>Time Played</p>
                            <p className={`text-lg text-white font-medium`}>15h 39m</p>
                            <p className={`text-green-400 text-sm`}>+1h 41m This Week</p>
                        </div>
                        <div className={`bg-neutral-700 p-2 rounded-lg drop-shadow-sm col-span-2`}>
                            <p className={`text-sm text-gray-300`}>Win Rate</p>
                            <p className={`text-lg text-white font-medium`}>65%</p>
                            <p className={`text-red-400 text-sm`}>-5% This Week</p>
                        </div>
                        <div className={`bg-neutral-700 p-2 rounded-lg drop-shadow-sm col-span-2`}>
                            <p className={`text-sm text-gray-300`}>Avg. Run Time</p>
                            <p className={`text-lg text-white font-medium`}>27m</p>
                            <p className={`text-red-400 text-sm`}>+2m This Week</p>
                        </div>
                    </div>
                </div>
                <div className={`col-span-3 rounded-lg p-5 bg-neutral-800 h-fit`}></div>
                <div className={`col-span-3 rounded-lg p-5 bg-neutral-800 h-fit`}></div>
                <div className={`col-span-3 rounded-lg p-5 bg-neutral-800 h-fit`}></div>
                <div className={`col-span-3 rounded-lg p-5 bg-neutral-800 h-fit`}></div>
                <div className={`col-span-6 rounded-lg p-5 bg-neutral-800 h-fit`}></div>
            </div>
        </div>
    );
}