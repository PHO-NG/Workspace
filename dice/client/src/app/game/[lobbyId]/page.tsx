'use client'
import { FC, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { io } from 'socket.io-client'
import PlayerIcons from '@/components/PlayerIcons'



const Page: FC = () => {
  // const lobbyId = usePathname().split('/')[2]
  const [playerList, setPlayerList] = useState<PlayerGameState[]>([])
  // const [lobbySettings, setLobbySettings] = useState<Lobby>();
  // const [dice, setDice] = useState<number[]>(Array.from({length: 5}, () => Math.floor(Math.random() * 6) + 1))
  const [count, setCount] = useState<number>(2)
  const tempArr : PlayerGameState[] = Array(Math.max(6)).fill({

  })

  // useEffect(() => {
    
  // })


  // const handleRoll = () => {
  //   setDice(Array.from({length: 5}, () => Math.floor(Math.random() * 6) + 1))
  // }

  const players = tempArr.map((player, index) => (
    <div key={index}>
      <h1>NAME</h1>
      <PlayerIcons 
          icon={'/crew1.png'}
          size={50}
      />
    </div>
  ))
  
  return <>
    <div className='w-[600px] h-[321px] border-[12px] rounded-full border-red m-auto mt-24 flex justify-evenly'>
      {players}
      {/* https://stackoverflow.com/questions/16613809/how-to-create-circles-around-a-circle-with-css-javascript */}
    </div>
  </>
}
export default Page