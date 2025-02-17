export function Message(messageText) {
    return (
        <div key={messageText.key} className={`h-fit w-9/12`}>
            <p className={`font-bold text-white h-fit`}>{messageText.from}: <span className={`font-thin h-fit`}>{messageText.text}</span></p>
        </div>
    )
}

export default function MessageComponent({children, type, text}) {
    return (
        <div className={`flex gap-2 w-[90%]`}>
            {type === "prompt" ? (
                <div className={`flex items-start gap-4`}>
                    <div className={`p-5 bg-neutral-600 rounded-full h-fit w-fit`}></div>
                    <div className={`flex flex-col gap-3`}>
                        { children }
                    </div>
                    {/* <div className={`flex flex-col gap-1.5`}>
                        <p className={`font-semibold text-white`}>{data.from}</p>
                        <p className={`text-white w-9/12`}>{data.text}</p>
                    </div> */}
                </div>
            ) : (
                <div className={`justify-end flex items-end gap-4 ml-auto`}>
                    <p className={`px-4 py-2.5 rounded-xl bg-neutral-600 text-white w-9/12`}>{text}</p>
                    <div className={`p-5 bg-neutral-600 rounded-full h-fit w-fit mb-auto`}></div>
                </div>
            )}
        </div>
    )
}