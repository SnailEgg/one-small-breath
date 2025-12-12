const Button = ({ text, canSubmit=true, theme="terminal", className="", buttonType="button", onClick=()=>{} }) => {
    const themes = {
        story: {
            enabled:
                <button type={buttonType} className={`${className} border border-[--story-primary] bg-[--story-primary] text-[--story-bg] active:bg-transparent active:text-[--story-primary] focus:outline-none focus:bg-transparent focus:text-[--story-primary] font-bold hover:before:content-['--'] hover:after:content-['--']`} onMouseOut={ (e) => { e.target.blur(); } } onClick={ (e) => { e.target.blur(); onClick() }}>{text}</button>,
            disabled:
                <button type={buttonType} className={`${className} border border-[--story-primary] bg-transparent text-[story-primary] font-bold`} disabled>{text}</button>
        },
        terminal: {
            enabled:
                <button type={buttonType} className={`${className} border border-[--terminal-primary] bg-[--terminal-primary] text-[--terminal-bg] active:bg-transparent active:text-[--terminal-primary] focus:outline-none focus:bg-transparent focus:text-[--terminal-primary] font-bold hover:before:content-['--'] hover:after:content-['--']`} onMouseOut={ (e) => { e.target.blur(); } } onClick={ (e) => { e.target.blur(); onClick() }}>{text}</button>,
            disabled:
                <button type={buttonType} className={`${className} border border-[--terminal-primary] bg-transparent text-[terminal-primary] font-bold`} disabled>{text}</button>
        }
    }

    const thisButton = themes[theme][canSubmit ? "enabled" : "disabled"];
    
    return thisButton;
}

export default Button;