const ChatMessage = ({ text, name, isFirst }) => {
    const textLines = text.split('\n'); // split text into multiple lines

    return (
        <div className={`flex flex-col md:flex-row ${isFirst ? '' : "pt-4"} break-word`}>
            <p className="w-[8.7rem] shrink-0 font-bold md:text-end md:pr-3">{name}:</p>
            <div className="w-full italic">
                { 
                    textLines.map((line, index) => {
                        return line ? <p key={index}>{line}</p> : <div key={index} className='h-2'></div>
                    })
                }
            </div>
        </div>
    )
}

export default ChatMessage;