import { useState } from 'react';
import Button from './Button';

const SubmitButton = ({ text, canSubmit, theme="terminal", completionHint="Kindly fill all fields" }) => {
    const [ showCompletionHint, setShowCompletionHint ] = useState(false);

    <Button text={text} canSubmit={canSubmit} theme={theme} className='block w-full p-2'></Button>

    return (
        <div onMouseOver={ () => { setShowCompletionHint(true) } } onMouseOut={ () => { setShowCompletionHint(false) } }>
            {
                canSubmit
                ? <Button text={text} canSubmit={canSubmit} theme={theme} className='block w-full p-2 glow-box glow-text' buttonType='submit'></Button>
                : <Button text={showCompletionHint ? completionHint : text} canSubmit={canSubmit} theme={theme} className='block w-full p-2 glow-box glow-text' buttonType='submit'></Button>
            }  
        </div>
    )
}

export default SubmitButton;