"use client"
import Link from 'next/link'
import { Merriweather_Sans } from 'next/font/google'
import Button from '@/app/Button';
const merriweather_sans = Merriweather_Sans({subsets: ["latin"]});

export default function Home() {
    return (
        <div className="min-w-[100vw] min-h-[100vh] bg-[--story-bg]">
            <div className={`${merriweather_sans.className} flex justify-center w-full p-[2.5vh] pt-[20vh] text-[--story-primary] selection:bg-[--story-primary] selection:text-[--story-bg]`}>
                <div className="flex flex-col items-center justify-center w-full md:w-[35rem] text-justify">
                    <h1 className="w-full text-2xl pb-4">Thank you for playing One Small Breath.</h1>
                    <p className="w-full pb-4">This was a college assignment turned hobby project. I hope you&apos;ve enjoyed it.</p>
                    <p className="w-full pb-4">You can see more games and other things I&apos;ve made below.</p>
                    <p className="w-full pb-12">I also hugely appreciate any support to keep this and other projects online.</p>
                    <div className="flex justify-around w-full">
                        <Link href="https://snailegg.github.io/portfolio" target='_blank' className='w-[10rem]'>
                            <Button buttonType="button" className="py-2 w-full" theme="story" text="More by me"></Button>
                        </Link>
                        <Link href="https://ko-fi.com/snailegg" target='_blank' className='w-[10rem]'>
                            <Button buttonType="button" className="py-2 w-full" theme="story" text="Support me"></Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}