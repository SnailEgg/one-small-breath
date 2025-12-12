"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = ({ tabsData }) => {
    const page = usePathname().replace(/\/.*\//, '');

    return (
        <nav>
            <ul className="flex">
            {
                tabsData.map( ({name, link, onlySmall }) => {
                    const active = link === page;
                    return (
                        active
                        ? <li key={name} className={`border border-b-0 border-[--terminal-primary] bg-[--terminal-primary] text-black p-3 grow glow-box`}>
                            <h1>{name}</h1>
                          </li>
                        : <li key={name} className={`${onlySmall ? 'lg:hidden' : ''} border border-b-0 border-[--terminal-primary] hover:bg-[--terminal-primary] hover:text-black grow glow-box`}>
                            <Link shallow={true} href={link ? link : "#"} className="block p-3 focus:outline-none focus:bg-[--terminal-primary] focus:text-black" >
                                {name}
                            </Link>
                          </li>
                    )
                })
            }
            </ul>
        </nav>
    )
}

export default Navbar;