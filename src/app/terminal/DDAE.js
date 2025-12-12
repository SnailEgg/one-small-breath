import React from "react";
import Button from "../Button";
import SearchHistory from "./SearchHistory";
import SendButton from "./SendButton";
import axios from "axios";
import Document from "./Document";
import { useRouter } from "next/navigation";
import { setUser } from "@/redux/user-slice";
import { connect } from "react-redux";
import store from "@/redux/store";

const DDAE = ({ setUser }) => {
    const storedDocument = store.getState().user?.user?.storedDocument || null;

    const defaultPlaceholder = 'Enter a DDA code to find a document';

    const [ docInput, setDocInput ] = React.useState('');
    const [ document, setDocument ] = React.useState(storedDocument);
    const [ showHistory, setShowHistory ] = React.useState();
    const [ placeholder, setPlaceholder ] = React.useState(defaultPlaceholder);

    const router = useRouter();

    React.useEffect(() => {
        setUser({ ...store.getState().user.user, storedDocument: document });
    }, [document]);

    const queryDocs = async (event) => {
        event.preventDefault();

        const input_code = docInput.toUpperCase();
        setDocInput('');

        // don't search if already viewing the requested document
        if (input_code === document?.document_code) return;

        setPlaceholder('Decrypting DDA...');

        try {
            const response = await axios.get(`/api/search?doc=${input_code}`);
            await axios.patch('/api/search/history', { code: input_code });
            setDocument(response.data.document);
        } catch ({ status }) {
            if (status === 401 || status === 403) {
                setUser(null);
                router.push("/authenticate/login");
            }
            if (status >= 500 && status < 600) {
                setPlaceholder('Unexpected error... Please try again later.')
            } else {
                setDocument(null);
                setPlaceholder(`No valid document produced by code ${input_code}`);
            }
        }
    }

    const handleDocInput = (event) => {
        // remove starting whitespace, convert whitespace to dashes, remove consecutive dashes
        setDocInput(event.target.value
                                .replace(/^\s+/, '')
                                .replace(/\s/g, '-')
                                .replace(/--+/, '-'));
    }

    return (
        <div className="flex h-full">
            <section className="hidden grow-0 shrink-0 xl:flex flex-col w-1/3 h-full border border-[--terminal-primary] glow-box p-[2.5vh] mr-[2.5vh]">
                <SearchHistory document={document} setDocument={setDocument} />
            </section>
            <section className={`grow flex flex-col ${showHistory ? 'hidden xl:flex' : ''}`}>
                <h2 className="text-sm sm:text-xl text-center md:text-start mb-[2vh]">Digital Documents Archive Explorer</h2>
                <form onSubmit={queryDocs} className="w-full flex mb-[2vh]">
                    <input maxLength='9' className="uppercase p-2 mr-2 border border-[--terminal-primary] bg-transparent focus:outline-none placeholder:text-[--terminal-primary] placeholder:italic grow glow-box glow-text" type="text" onChange={handleDocInput} placeholder="..." value={docInput}/>
                    <SendButton canSubmit={docInput.length > 0} className='glow-box py-2 px-6 glow-text' buttonType='submit' />
                </form>
                <div className='grow overflow-auto scrollbar-terminal'>
                    { 
                        document
                        ? <Document {...document} />
                        : <p className="italic">{placeholder}</p>
                    }
                </div>
                <Button onClick={() => { setShowHistory(true); }} text="See Search History" className="xl:hidden w-full p-2 mt-[2.5vh] glow-box glow-text" />
            </section>
            <section className={`flex flex-col w-full h-full scrollbar-terminal ${showHistory ? 'block xl:hidden' : 'hidden'}`}>
                <SearchHistory document={document} setDocument={setDocument} setShowHistory={setShowHistory} />
                <Button onClick={() => { setShowHistory(false); }} text="Return to DDAE" className="w-full mt-6 p-2 glow-box glow-text" />
            </section>
        </div>
    );
}

export default connect(null, {setUser})(DDAE);