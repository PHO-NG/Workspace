'use client'
import { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import { Socket } from 'socket.io-client'

import Title from '@/components/Title/Title'
import LobbyCard from '@/components/LobbyCard'


interface LobbyProps {
  playerList: PlayerStatus[]
  lobbySettings: Lobby
  socket: Socket
  text: {
    button: string,
    reroll: string,
    initialAmount: string
  }
}

const Lobby: FC<LobbyProps> = ({playerList, lobbySettings, socket, text}) => {
    const [lobbyMap, setLobbyMap] = useState<JSX.Element[]>()

    useEffect(() => {
        if (playerList != undefined) {
          let tempList = playerList;
          tempList = [ ...tempList, ...Array(Math.max(6 - tempList.length)).fill({
            id: "",
            name: "",
            icon: "",
            ready: false,
            host: false,
            filled: false,
            loaded: false
          })];
          setLobbyMap(tempList.map((player, index) => (
            <LobbyCard 
              {...player}
              key={index}
              index={index}
            />
          )))
        }
      }, [playerList])

      const handleClick = () => {
        socket.emit('player-ready', socket.id, lobbySettings.lobbyId)
        console.log("PRESSED BUTTON")
      }

    return <>
    <div>
      <Title />
      <Link href="/" className='absolute left-3 top-3'>EXIT</Link>
      <div className='flex justify-evenly'>
        <div className='flex flex-col w-5/12'>
          {lobbyMap}
          <div className='flex justify-between w-10/12 mx-auto'>
            {lobbySettings?.spectator == true &&
            <div className='flex text-4xl w-64 m-auto p-3 bg-[#161616]'>
              <h2 className='text-4xl'>SPECTATE</h2>
              <div className='border-red border-4 rounded-full w-10 h-10 mx-auto'>
                <h2 className='text-2xl text-center font-bold'>2</h2>
              </div>
            </div>
            }
            <button onClick={handleClick} className='text-4xl border-red border-8 rounded-xl w-64 m-auto p-2'>{text.button}</button>
          </div>
        </div>

        <div className='w-5/12'>
          <h2 className='text-4xl'>ROOM NAME: {lobbySettings?.lobbyName}</h2>
          <h2 className='text-4xl my-3'>INITIAL AMOUNT: {text.initialAmount}</h2>
          <div className='flex'>
            <h2 className='text-4xl'>RE-ROLL DICE: {text.reroll} </h2>
          </div>
        </div>

      </div>
    </div>
  </>
}

export default Lobby