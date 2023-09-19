'use client'
import React from 'react'
import { io } from 'socket.io-client'
import CreateLobby from '@/components/CreateLobby';
import Title from '@/components/Title/Title';
import './globals.css'

const socket = io('https://liars-dice-express-d026f352885a.herokuapp.com/', {
  transports: ["websocket", "polling"]
})
// const socket = io('http://localhost:3001/', {
//   transports: ["websocket", "polling"]
// })

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
          <button className="absolute left-2/4 -translate-x-2/4 top-1/2 bg-gray hover:bg-darkgray text-4xl py-3 px-16 rounded-lg" onClick={() => setInitiate(true)}>Online Play</button>
          :
          <>
            <button className="absolute top-3 left-3 text-red hover:text-white text-3xl font-bold" onClick={() => setInitiate(false)}>BACK</button>
            <CreateLobby gameId={gameId} socket={socket}/>
          </>
        }
      </div>
    </main>
  )
}