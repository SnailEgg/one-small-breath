import axios from 'axios'
import React from 'react'
import ChatMessage from '@/app/terminal/ChatMessage';
import store from '@/redux/store';
import SendButton from './SendButton';
import { useRouter } from 'next/navigation';
import { connect } from 'react-redux';
import { setUser } from '@/redux/user-slice';

const Chatbox = ( { setUser } ) => {
    const userState = store.getState();
    const username = userState.user?.user?.username;
    const router = useRouter();

    const [ messages, setMessages ] = React.useState(userState.user?.user?.storedMessages || []);
    const [ input, setInput ] = React.useState('');
    const [ canSend, setCanSend ] = React.useState(false);

    React.useEffect( () => {
        (async () => {
            try {
                const response = await axios.get("/api/chat/");
                setMessages(response.data.result);
                setCanSend(true);
            } catch (error) {
                setUser(null);
                router.push("/authenticate/login");
            }
        })();
    }, []);

    // save the messages to the redux store whenever they're updated
    React.useEffect(() => {
        setUser({ ...store.getState().user.user, storedMessages: messages });
    }, [messages]);

    const sendChat = async (event) => {
        event.preventDefault();

        const newQuery = input;
        // don't send a message if the query is empty
        if (!newQuery) {
            return;
        }

        setCanSend(false);
        try {
            // give the user immediate feedback by emptying the input field
            // and adding their message to the chatbox
            setInput('');
            setMessages([...messages, {role: "user", content: newQuery, id: "temp-user"}, {role: "assistant", content: "...", id: "temp-assistant"}]);

            // get AI response to the message and update the chatbox
            const response = await axios.post("/api/chat/", {query: newQuery});
            setMessages(response.data.result);
        } catch (error) {
            const status = error.status;
            if (status === 401 || status === 403) {
                setUser(null);
                router.push("/authenticate/login");
            }
        }
        setCanSend(true);
    }

    const handleInput = (event) => {
        setInput(event.target.value);
    }

    return (
        <div className="flex flex-col h-full">
            <div className="overflow-y-auto flex flex-col-reverse relative grow scrollbar-terminal">
                { messages.toReversed().map( (message, index) => {
                    if (message.role === 'system') return;
                    
                    return (
                        <ChatMessage key={message.id} text={message.content} name={message.role === 'user' ? username || 'user' : message.role} isFirst={index===messages.length-1}></ChatMessage>
                    );
                } ) }
            </div>
            <form onSubmit={sendChat} className="flex mt-[2.5vh]">
                <input className="start-focused p-2 mr-2 border border-[--terminal-primary] bg-transparent focus:outline-none placeholder:text-[--terminal-primary] placeholder:italic grow glow-box glow-text" type="text" onChange={handleInput} placeholder="..." value={input}/>
                <SendButton canSubmit={input.length > 0 && canSend} className='glow-box py-2 px-6 glow-text' buttonType='submit'></SendButton>
            </form>
        </div>
    );
}

export default connect(null, {setUser})(Chatbox);