'use client'
import React from 'react'
import Title from '../components/Title/Title'
import Link from 'next/link'
import LobbyCard from '../components/LobbyCard'


export default function Home() {
  const [lobbySettings, setLobbySettings] = React.useState({
    lobbyName: "",
    initialAmount: 0,
    reroll: true,
    spectators: true,
    openLobby: true,
    inviteLink: "TEST",
  })

  const [playerList, setPlayerList] = React.useState([{
    name: "",
    id: 0,
  }])

  // const lobby = playerList.map((player, index) => (
  //   <LobbyCard 
  //     {...player}
  //     key={index}
  //   />
  // )
    
  // )

  return (
    <main >
      <Title />
      <Link href="/" className='absolute left-3 top-3'>EXIT</Link>
      <div className='flex justify-evenly'>
        <div className='border-2'>
          PLAYER CARDS
        </div>

        <div className='border-2'>
          <h2 className='text-3xl'>ROOM NAME: {lobbySettings.lobbyName}</h2>
          <h2 className='text-3xl'>INITAL AMOUNT: {lobbySettings.initialAmount}</h2>
          <div className='flex'>
            <h2 className='text-3xl'>RE-ROLL DICE: </h2>
            <input type="checkbox" id="invite" name="invite" defaultChecked={lobbySettings.reroll ? true : false} />
          </div>

          {
          lobbySettings.openLobby == true &&
          <div>
            <h3>Share lobby link:</h3>
            <div className='bg-[#0000006b] w-full'>
              <h3>{lobbySettings.inviteLink}</h3>
            </div>
          </div>
          }
          
        </div>

      </div>
      
    </main>
  )
}