'use client'
import CreateLobby from '@/components/CreateLobby';
import Info from '@/components/Info/Info';
import Title from '@/components/Title/Title';
import React from 'react';
import { io } from 'socket.io-client';
import './globals.css';

const socket = io('https://liars-dice-express-d026f352885a.herokuapp.com/', {
  transports: ["websocket", "polling"]
})
// const socket = io('http://localhost:3001/', {
//   transports: ["websocket", "polling"]
// })

export default function Home() {
  const [initiate, setInitiate] = React.useState(false)
 
  return (
    <main>
      <Title />
      <Info />
      <div>
        {
          initiate === false
          ?
          <button className="absolute left-2/4 -translate-x-2/4 top-1/2 bg-gray hover:bg-darkgray text-4xl py-3 px-16 rounded-lg" onClick={() => setInitiate(true)}>Online Play</button>
          :
          <>
            <button className="absolute top-3 left-3 text-red hover:text-white text-3xl font-bold" onClick={() => setInitiate(false)}>BACK</button>
            <CreateLobby gameId={socket.id} socket={socket}/>
          </>
        }
      </div>
    </main>
  )
}