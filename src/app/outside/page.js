"use client"
import { Merriweather_Sans } from 'next/font/google'
import Button from '@/app/Button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
const merriweather_sans = Merriweather_Sans({subsets: ["latin"]});

export default function Home() {
    const [ isOver, setIsOver ] = useState(false);
    const [ showLink, setShowLink ] = useState(false);
    const [ isOutside, setIsOutside ] = useState(false);
    const router = useRouter();

    const endGame = () => {
        setIsOver(true);
        axios.post('/api/logout');
        setTimeout(() => { setShowLink(true); }, 5000);
    }

    // redirect the user to the game if they haven't completed it yet
    useEffect(() => {
        ( async () => {
            try {
                const response = await axios.get('/api/authenticate');
                if (!response.data?.account?.is_outside) {
                    throw new Error('Game not completed');
                }
                setIsOutside(true);
            } catch (error) {
                router.push('/terminal/help');
            }
        })();
    }, []);

    // don't show the user the ending screen if we're not sure they've completed the game
    if (!isOutside) {
        return <div className="min-w-[100vw] min-h-[100vh] bg-[--story-bg]"></div>;
    }

    return (
        <div className="min-w-[100vw] min-h-[100vh] bg-[--story-bg]">
            <div className={`${merriweather_sans.className} flex justify-center w-full p-[2.5vh] pt-[20vh] text-[--story-primary] selection:bg-[--story-primary] selection:text-[--story-bg]`}>
                { 
                    !isOver
                    ? <div className="flex flex-col items-center justify-center w-full md:w-[35rem] text-justify">
                        <h1 className="w-full text-2xl pb-4">You find yourself alone on a black, silent night.</h1>
                        <p className="w-full pb-4">Just as dark and quiet as the night is the city ahead, its lightless towers made visible only by the gaps they leave in the starry sky.</p>
                        <p className="w-full pb-4">You leave the station behind you and sit beneath an oak tree.</p>
                        <p className="w-full pb-12">Your eyelids are suddenly heavy. You feel like you&apos;ve been awake for three hundred thousand years.</p>
                        <div className='w-[15rem]'>
                            <Button buttonType="button" onClick={endGame} className="py-2 w-full" theme="story" text="Close your eyes"></Button>
                        </div>
                    </div>
                    : <div className='flex flex-col justify-between items-center h-[15rem]'>
                        <h1 className='text-2xl'>And the world closes its eyes.</h1>
                        { showLink ? <Link href='/credits' className='w-[15rem]'><Button text='End' className="py-2 w-full" theme='story' /></Link> : '' }
                    </div>
                }
            </div>
        </div>   
    );
}