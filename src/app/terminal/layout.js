import Navbar from "../Navbar";
import Profile from "./Profile";

export const metadata = {
    title: "Station Terminal"
}

export default function TerminalLayout({ children }) {
    const tabs = [
        {
            name:   "Help",
            link:   "help",
        },
        {
            name:   "DDAE",
            link:   "ddae",
        },
        {
            name:   "Status",
            link:   "status",
        },
        {
            name:       "User",
            link:       "user",
            onlySmall:  true
        }
    ];

    return (
        <div className="min-w-[100vw] min-h-[100vh] bg-[--terminal-bg] text-[--terminal-primary] selection:bg-[--terminal-primary] selection:text-[--terminal-bg] glow-text">
            <div className='flex p-[2.5vh] h-[100vh] w-full'>
                <div className="grow overflow-hidden flex flex-col lg:pr-[2.5vh]">
                    <div className="w-full md:w-2/3 md:max-w-[50rem]">
                        <Navbar tabsData={tabs} />
                    </div>
                    <main className="grow border-2 border-[--terminal-primary] p-[2.5vh] glow-box overflow-y-hidden">
                        {children}
                    </main>
                </div>
                <Profile />
            </div>
        </div>
    )
}