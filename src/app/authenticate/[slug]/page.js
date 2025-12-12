"use client"
import { Provider } from 'react-redux'
import store from '@/redux/store'
import AuthenticateUser from '@/app/authenticate/AuthenticateUser'
import React from 'react'
import { useParams } from 'next/navigation'

export default function Home() {
  const params = useParams();

  return (
    <Provider store={store}>
      <AuthenticateUser form={params.slug} />
    </Provider>
  );
}