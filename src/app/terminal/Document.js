import store from "@/redux/store";

const Document = ({ document_code, title, source, author, content, date }) => {
    const fallbackName = 'Sienna Brooks';

    const userState = store.getState();
    const fullName = userState.user?.user?.name;
    content = content.map((line) => {
                // in case any names used in the story are the player's name, replace it with a fallback
                // Except if the user's name is Jackson Chelsea; they'll just have to live with it
                if (fullName !== 'Jackson Chelsea') {
                    line = line.replace(fullName, fallbackName);
                };
                return line.replace('[full name]', fullName); 
              });
    
    return (
        <article>
            <div className="pb-2 border-b border-[--terminal-primary]">
                <h3 className="text-xl mb-1">{title}</h3>
                <p className="text-sm">{document_code}</p>
            </div>
            <div className="py-2 mb-4 flex flex-col md:flex-row justify-around border-b border-[--terminal-primary] break-word">
                <div className="flex md:flex-col w-full md:w-1/3 px-2">
                    <p className="md:text-center italic font-bold w-[5rem] md:w-full">Type</p><p className="md:text-center">{source}</p>
                </div>
                <div className="hidden md:block w-0 border-l border-[--terminal-primary]"></div>
                <div className="flex md:flex-col w-full md:w-1/3 px-2">
                    <p className="md:text-center italic font-bold w-[5rem] md:w-full">Author</p><p className="md:text-center">{author}</p>
                </div>
                <div className="hidden md:block w-0 border-r border-[--terminal-primary]"></div>
                <div className="flex md:flex-col w-full md:w-1/3 px-2">
                    <p className="md:text-center italic font-bold w-[5rem] md:w-full">Date</p><p className="md:text-center">{date?.replace(/T.*/, '') || 'No date'}</p>
                </div>
            </div>
            {content.map((element, index) => {
                return ( 
                    element
                    ? <p key={index} className='p-1'>{element}</p>
                    : <div key={index} className='h-4'></div>
                );
            })}
        </article>
    )
}

export default Document;