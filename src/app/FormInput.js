import React from "react";

const FormInput = ({ inputType="text", text, setText, labelText, autofill="on" }) => {
    const inputID = "input-" + labelText.replace(/\s+/g, '').toLowerCase();

    // in cases where the input field is autofilled, this
    // updates the state variable to use the autofilled value
    React.useEffect( () => {
        setText(document.getElementById(inputID).value);
    }, []);

    return (
        <>
            <label htmlFor={inputID} className="block">{labelText}</label>
            <input id={inputID} className="p-[0.6rem] w-full border border-[--terminal-primary] bg-transparent focus:outline-none focus:border-x-[0.4rem] focus:px-[0.275rem] autofill:bg-[--terminal-primary] autofill:text-black glow-box glow-text" autoComplete={autofill} type={inputType} onChange={ (e) => { setText(e.target.value); } } value={text} />
        </>
    )
}

export default FormInput;