"use client"
import store from '@/redux/store'
import React from 'react'
import { useParams, useRouter, redirect } from 'next/navigation'
import Authenticator from '@/redux/Authenticator'
import Terminal from '../Terminal'
import { Provider } from 'react-redux'

export default function Home() {
  const userState = store.getState();
  const user = userState.user.user;
  const userIsAuthenticated = user?.isAuthenticated || false;
  
  const [ isAuthenticated, setIsAuthenticated ] = React.useState(userIsAuthenticated);
  const params = useParams();
  const page = params.slug;

  return (
    <Provider store={store}>
      <Authenticator setIsAuthenticated={setIsAuthenticated}></Authenticator>
      { 
        isAuthenticated 
        ? <Terminal page={page} /> 
        : <div className="w-screen h-screen fixed top-0 left-0 bg-[--terminal-bg]"></div>
      }
    </Provider>
  )
}