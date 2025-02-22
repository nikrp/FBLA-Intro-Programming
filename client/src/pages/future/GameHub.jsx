import { RiUser3Fill } from "react-icons/ri";
import { IoIosCreate } from "react-icons/io";
import { TbSwords } from "react-icons/tb";

{/* Colored Game Hub */}
export default function GameHub() {
    return (
        <div className={`min-h-screen w-screen flex flex-row gap-5 py-5 bg-purple-300`}>
            <div className={`w-1/5 ml-5`}></div>
            <div className={`w-[20%] p-5 fixed top-5 left-5 h-[95vh] bg-white rounded-lg`}>
                <p>Hello</p>
            </div>
            <div className={`w-4/5 grid grid-cols-12 gap-5 mr-5 ml-4 justify-between`}>
                <div className={`col-span-4 w-full rounded-lg bg-yellow-200 p-5 pb-9 h-fit hover:scale-105 transition-all duration-200 ease-in-out hover:opacity-80 cursor-pointer`}>
                    <RiUser3Fill fill="black" size={70} className={`mx-auto mb-2`} />
                    <p className={`text-3xl text-center font-semibold`}>Solo Adventure</p>
                </div>
                <div className={`col-span-4 w-full rounded-lg bg-orange-200 p-5 pb-9 h-fit hover:scale-105 transition-all duration-200 ease-in-out hover:opacity-80 cursor-pointer`}>
                    <TbSwords color="black" size={70} className={`mx-auto mb-2`} />
                    <p className={`text-3xl text-center font-semibold`}>1v1 Adventure</p>
                </div>
                <div className={`col-span-4 w-full rounded-lg bg-red-200 p-5 pb-9 h-fit hover:scale-105 transition-all duration-200 ease-in-out hover:opacity-80 cursor-pointer`}>
                    <IoIosCreate fill="black" size={70} className={`mx-auto mb-2`} />
                    <p className={`text-3xl text-center font-semibold`}>Create an Adventure</p>
                </div>
                <div className={`col-span-8`}>
                    <p className={`text-2xl font-bold mb-2`}>Statistics</p>
                    <div className={`flex flex-row gap-5 flex-wrap w-full`}>
                        <div className={`bg-blue-300 rounded-lg p-2.5 opacity-80`}>
                            <p className={`text-sm`}>Adventures Played</p>
                            <p className={`text-lg font-medium`}>137</p>
                            <p className={`text-sm`}>+14 This Week</p>
                        </div>
                        <div className={`bg-blue-300 rounded-lg p-2.5 opacity-80`}>
                            <p className={`text-sm`}>Adventures Played</p>
                            <p className={`text-lg font-medium`}>137</p>
                            <p className={`text-sm`}>+14 This Week</p>
                        </div>
                        <div className={`bg-blue-300 rounded-lg p-2.5 opacity-80`}>
                            <p className={`text-sm`}>Adventures Played</p>
                            <p className={`text-lg font-medium`}>137</p>
                            <p className={`text-sm`}>+14 This Week</p>
                        </div>
                        <div className={`bg-blue-300 rounded-lg p-2.5 opacity-80`}>
                            <p className={`text-sm`}>Adventures Played</p>
                            <p className={`text-lg font-medium`}>137</p>
                            <p className={`text-sm`}>+14 This Week</p>
                        </div>
                    </div>
                </div>
                <div className={`col-span-4 rounded-lg bg-indigo-400 p-5 w-full`}>
                    <p className={`text-2xl font-bold mb-2`}>Friends</p>
                </div>
            </div>
        </div>
    );
}