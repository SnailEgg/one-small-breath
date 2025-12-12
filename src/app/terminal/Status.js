import { useState } from "react";
import FormInput from "../FormInput";
import SubmitButton from "../SubmitButton";
import axios from "axios";
import { useRouter } from "next/navigation";
import ErrorMessage from "../ErrorMessage";

const Status = () => {
    const [ input, setInput ] = useState('');
    const [ isActive, setIsActive ] = useState(true);
    const [ showError, setShowError ] = useState(false);
    const router = useRouter();

    const sendCode = async (event) => {
        event.preventDefault();

        const code = input;
        setInput('');

        try {
            const response = await axios.post('/api/shutdown', { code: code });
            setShowError(false);
            setIsActive(false);
            setTimeout(() => { router.push('/outside') }, 2000);
        } catch (error) {
            setShowError(true)
        }
    }

    return (
        <section className='flex flex-col h-full w-full md:pt-20 items-center overflow-y-auto scrollbar-terminal'>
            <div className='w-full max-w-[33rem]'>
            <h2 className="text-3xl text-center mb-4">Station Status</h2>
            <div className="pb-3">
                <p><span className="font-bold">Generator:</span> <span className="italic">{isActive ? 'Active' : 'INACTIVE'}</span></p>
                <p><span className="font-bold">Door Lock:</span> <span className="italic">{isActive ? 'Engaged' : 'RELEASED'}</span></p>
            </div>
            <div className="pb-4">
                <p><span className="font-bold">Total Stations Active:</span> <span className="italic">{isActive? '1' : '0'}</span></p>
            </div>
            {
                showError 
                ? <div>
                    <ErrorMessage message='Incorrect code entered.' />
                  </div> 
                : ''
            }
            {
                !isActive
                ? <div className='pb-4'>
                    <p className="text-xl text-center">### SUDDEN POWER LOSS -- SHUTTING DOWN ###</p>
                  </div>
                : ''
            }
            <form className='pt-2' onSubmit={sendCode}>
                <div className='pb-4'>
                    <FormInput text={input} setText={setInput} labelText='Generator Override Code' autofill='off' />
                    <p className='pt-1 italic'>Code hint: The last country to get with the program + the number of this Station</p>
                </div>
                <SubmitButton text='Disable generator' canSubmit={input.length > 0} completionHint='Enter the override code' />
            </form>
            </div>
        </section>
    );
}

export default Status;