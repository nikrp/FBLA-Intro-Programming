// Import Framer Motion and React
import { motion } from "framer-motion";
import React from "react";

// Animations for the text
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5,
      },
    },
  };

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Seperate component for each line.
export function Message(messageText) {
    return (
        <div key={messageText.key} className={`h-fit w-9/12`}>
            <p className={`font-bold text-white h-fit`}>{messageText.from}: <span className={`font-thin h-fit`}>{messageText.text}</span></p>
        </div>
    )
}

// Main component that can hold all of the Message components for each dialouge line.
// Type represents whether the message was a response from the player or dialouge.
export default function MessageComponent({children, type, text}) {
    return (
        <div className={`flex gap-4 w-[100%]`}>
            {type === "prompt" ? ( // Dialouge
                <div className={`flex items-start gap-4`}>
                    <div className={`p-5 bg-neutral-600 rounded-full h-fit w-fit`}></div>
                    <motion.div
                        className="flex flex-col gap-3"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                    >
                        {React.Children.map(children, (child) => (
                            <motion.div variants={itemVariants}>{child}</motion.div>
                        ))}
                    </motion.div>
                </div>
            ) : ( // Response
                <div className={`justify-end flex items-end gap-4 ml-auto`}>
                    <p className={`px-4 py-2.5 rounded-xl bg-neutral-600 text-white w-9/12`}>{text}</p>
                    <div className={`p-5 bg-neutral-600 rounded-full h-fit w-fit mb-auto`}></div>
                </div>
            )}
        </div>
    )
}