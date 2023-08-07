/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { FC, useEffect, useState } from 'react'
import Title from '@/components/Title/Title'
import Link from 'next/link'
import LobbyCard from '@/components/LobbyCard'
import { useRouter } from 'next/router'
import { io } from 'socket.io-client'
const socket = io('http://localhost:3001')

type PlayerStatus = {
  id: string
  name: string
  icon: string
  ready: boolean,
  host: boolean,
  position: number,
  filled: boolean
}

const Page: FC = () => {
  const [lobbySettings, setLobbySettings] = useState({
    lobbyName: "",
    initialAmount: 0,
    spectator: true,
    openLobby: true,
    reroll: true,
  })

  const [playerList, setPlayerList] = useState<PlayerStatus[]>(Array(6).fill({
    id: "",
    name: "",
    icon: "/crew1.png",
    ready: false,
    host: false,
    position: 0,
    filled: false
  }))

  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    socket.on('get-lobby-data', (data) => {
      const hostStatus: PlayerStatus = {
        id: data.host.id,
        name: data.host.name,
        icon: data.host.icon,
        ready: false,
        host: true,
        position: 1,
        filled: true
      }
      let tempList = playerList
      tempList[hostStatus.position - 1] = hostStatus 
      setPlayerList(tempList)
      setLobbySettings({
        lobbyName: data.lobbyName,
        initialAmount: data.initialAmount,
        spectator: data.spectator,
        openLobby: data.openLobby,
        reroll: data.reroll,
      })
      setIsLoading(true)
      console.log("TEST")
    })
  }, [])
  
  let lobby = playerList.map((player, index) => (
    <LobbyCard 
      {...player}
      key={index}
    />
  ))

  return <>
  {isLoading == true &&
    <div>
      <Title />
      <Link href="/" className='absolute left-3 top-3'>EXIT</Link>

      <div className='flex justify-evenly'>
        <div className='flex flex-col w-5/12'>
          {lobby}
          <div className='flex justify-center w-10/12 mx-auto'>
            {lobbySettings.spectator == true &&
            <div className='flex text-4xl w-64 m-auto p-3 bg-[#161616]'>
              <h2 className='text-4xl'>SPECTATE</h2>
              <div className='border-red border-4 rounded-full w-10 h-10 mx-auto'>
                <h2 className='text-2xl text-center font-bold'>2</h2>
              </div>
            </div>
            }
            <button className='text-4xl border-red border-8 rounded-xl w-64 m-auto p-2'>START GAME</button>
          </div>
        </div>

        <div className='w-5/12'>
          <h2 className='text-4xl'>ROOM NAME: {lobbySettings.lobbyName}</h2>
          <h2 className='text-4xl my-3'>INITIAL AMOUNT: {lobbySettings.initialAmount}</h2>
          <div className='flex'>
            <h2 className='text-4xl'>RE-ROLL DICE: </h2>
            <input type='checkbox' className='ml-3' checked={lobbySettings.reroll} readOnly/>
          </div>
        </div>

      </div>
    </div>
    }
  </>
}

export default Page