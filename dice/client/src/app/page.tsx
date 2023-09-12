'use client'
import React from 'react'

import Link from 'next/link'
import { io } from 'socket.io-client'
import CreateLobby from '@/components/CreateLobby';
import Title from '@/components/Title/Title';
import './globals.css'
import TimerButton from '@/components/TimerButton/TimerButton';



const socket = io('http://localhost:3001' || 'https://liars-dice-express-d026f352885a.herokuapp.com/', {
  transports: ["websocket", "polling"]
})

export default function Home() {
  const [initiate, setInitiate] = React.useState(false)
  const [gameId, setGameId] = React.useState("")

  socket.on("get-userId", (arg) => {
    setGameId(arg)

    return (
      socket.off("get-userId")
    )
  })

 
  return (
    <main>
      <Title />
      {/* <UserSettings /> */}
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
            <button className="absolute top-3 left-3" onClick={() => setInitiate(false)}>BACK</button>
            <CreateLobby gameId={gameId} socket={socket}/>
          </>
        }
      </div>
    </main>
  )
}