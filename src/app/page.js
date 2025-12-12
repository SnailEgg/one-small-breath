"use client"
import Link from 'next/link'
import { Merriweather_Sans } from 'next/font/google'
import Button from './Button';
const merriweather_sans = Merriweather_Sans({subsets: ["latin"]});

export default function Home() {
  return (
    <div className="min-w-[100vw] min-h-[100vh] bg-[--story-bg]">
      <div className={`${merriweather_sans.className} flex justify-center w-full p-[2.5vh] pt-[20vh] text-[--story-primary] selection:bg-[--story-primary] selection:text-[--story-bg]`}>
        <div className="flex flex-col items-center justify-center w-full md:w-[35rem] text-justify">
          <h1 className="w-full text-2xl pb-4">You find yourself alone in a dim, bare room.</h1>
          <p className="w-full pb-4">Just as dark and empty as the room are your memories, replaced by a roaring headache.</p>
          <p className="w-full pb-4">The only exit is a hulking metal door sealed shut by a hefty electromagnet.</p>
          <p className="w-full pb-12">A computer terminal sits idle, softly glowing.</p>
          <Link href="/terminal/help" className='w-[15rem]'>
            <Button buttonType="button" className="py-2 w-full" theme="story" text="Approach the terminal"></Button>
          </Link>
        </div>
      </div>
    </div>
  )
}