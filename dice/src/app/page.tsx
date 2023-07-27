'use client'
import React from 'react'
import Link from 'next/link'
import Title from './components/Title';
import CreateLobby from './components/CreateLobby';

export default function Home() {
  const [initiate, setInitiate] = React.useState(false)

  return (
    <main >
      <Title />
      {/* <Settings /> */}
      <div>
        {
          initiate === false
          ?
          <div className='flex flex-col justify-center items-center'>
            <Link href="/self-play" className="bg-gray hover:bg-darkgray text-4xl py-3 px-20 rounded-lg m-16">Self Play</Link>
            <button className="bg-gray hover:bg-darkgray text-4xl py-3 px-16 rounded-lg" onClick={() => setInitiate(true)}>Online Play</button>
          </div>
          :
          <>
            <button onClick={() => setInitiate(false)}>Back</button>
            <CreateLobby />
          </>
        }
      </div>
      
      
    </main>
  )
}