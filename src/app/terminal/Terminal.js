"use client"
import React from 'react'
import Chatbox from '@/app/terminal/Chatbox'
import { redirect } from 'next/navigation'
import Profile from '@/app/terminal/Profile'
import DDAE from '@/app/terminal/DDAE'
import Status from './Status'

const Terminal = ({ page }) => {
  const pages = {
    ddae: <DDAE />,
    status: <Status />,
    help: <Chatbox />,
    user: <Profile canHide={false} />
  }
  
  if (pages[page] === undefined) {
    redirect("/terminal/help");
  }
  
  return pages[page];
}

export default Terminal;