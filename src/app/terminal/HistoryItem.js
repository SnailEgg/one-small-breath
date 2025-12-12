import axios from "axios";
import React from "react";

const HistoryItem = ({ document_code, setDocument, setShowHistory, theme="normal" }) => {
    const [ docInfo, setDocInfo ] = React.useState(null);

    React.useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`/api/search/?doc=${document_code}`);
                setDocInfo(response.data.document);
            } catch (error) {
                setDocInfo(null);
            }
        })();
    }, []);

    const handleClick = async () => {
        setDocument(docInfo);
        if (setShowHistory) {
            setShowHistory(false);
        }
    }

    const themes = {
        normal: "bg-[--terminal-primary] text-[--terminal-bg] hover:bg-[--terminal-bg] hover:text-[--terminal-primary]",
        invert: "bg-[--terminal-bg] text-[--terminal-primary] hover:bg-[--terminal-primary] hover:text-[--terminal-bg]"
    }

    // this makes the item wait until it's fully loaded to appear,
    // and it prevents items that reference nonexistant documents from appearing
    if (!docInfo) return null;

    const themeClasses = themes[theme] || themes.normal;

    return (
        <div className="pb-4">
            <button type="button" onClick={handleClick} className={`border border-[--terminal-primary] glow-text glow-box ${themeClasses} p-2 font-bold block w-full text-start`}>
                <h4 className="text-lg truncate">{docInfo.title}</h4>
                <p className="text-sm">{docInfo.document_code}</p>
            </button>
        </div>
    );
}

export default HistoryItem;