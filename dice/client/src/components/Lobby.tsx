'use client'
import { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Socket } from 'socket.io-client'
import { Tooltip as ReactTooltip } from "react-tooltip"

import Title from '@/components/Title/Title'
import LobbyCard from '@/components/LobbyCard'

interface LobbyProps {
  playerList: PlayerStatus[]
  lobbySettings: Lobby
  socket: Socket
}

const Lobby: FC<LobbyProps> = ({playerList, lobbySettings, socket}) => {
    const [lobbyMap, setLobbyMap] = useState<JSX.Element[]>()
    const url = "https://liars-dice-pho-ng.vercel.app" + usePathname()
    // const url = "http://localhost:3000" + usePathname()
    const [copied, setCopied] = useState<boolean>(false)
    const [displayText, setDisplayText] = useState({
      button: "",
      reroll: "",
      initialAmount: ""
    })

    useEffect(() => {
      if (playerList != undefined && lobbySettings != undefined) {
        const index = playerList.findIndex(player => player.id === socket.id)
        if (index !== -1) {
          setDisplayText({
            button: index === 0 ? "START GAME" : (playerList[index].ready ? "NOT READY" : "READY"),
            reroll: lobbySettings.reroll == true ? "ON" : "OFF", 
            initialAmount: lobbySettings.initialAmount == 1 ? "Dynamic": lobbySettings.initialAmount.toString()
          })
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playerList, lobbySettings])

    useEffect(() => {
      const timeout = setTimeout(() => {
        if (copied) {
          setCopied(false)
        }}, 1000)
      return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [copied])

    const handleClick = () => {
      socket.emit('player-ready', socket.id)
    }

    const handleCopy = () => {
      navigator.clipboard.writeText(url)
      setCopied(true)
    }

    return <>
    <div>
      <Title />
      <Link href="/" className='absolute left-3 top-3'>EXIT</Link>
      <div className='flex justify-evenly'>
        <div className='flex flex-col w-5/12'>
          {lobbyMap}
          <div className='flex justify-between w-10/12 mx-auto'>
            <button onClick={handleClick} className='text-4xl border-red border-8 rounded-xl w-64 m-auto p-2'>{displayText.button}</button>
          </div>
        </div>

        <div className='relative w-5/12 h-[420px]'>
          <h2 className='text-4xl'>ROOM NAME: {lobbySettings?.lobbyName !== undefined ? lobbySettings.lobbyName : ""}</h2>
          <h2 className='text-4xl my-3'>INITIAL AMOUNT: {displayText.initialAmount}</h2>
          <div className='absolute bottom-0 w-full'>
            <h2 className='text-xl ml-2'>Share lobby link</h2>
            <div className='relative bg-[#2323237e] py-1 px-2 w-10/12 flex'>
              <h2 className='text-xl'>{url}</h2>
              {/* <button onClick={() => navigator.clipboard.writeText(url)}>TEST</button> */}
              <button onClick={handleCopy} className='ml-auto'> 
                <div data-tooltip-id="copytoclipboard" className={copied ? 'ease-in-out duration-300 border-2 border-[#54000e9c] p-1 -m-1 rounded-lg' : 'duration-150 ease-out border-[#54000e9c]'}>
                  <Image 
                    src={'/copy.png'}
                    width={20}
                    height={20}
                    alt={'copy'}
                    priority={true}
                    placeholder={"blur"}
                    blurDataURL={'/copy.png'}
                  />
                  <ReactTooltip
                    id="copytoclipboard"
                    place="bottom"
                    content={copied ? "Copied!" : "Click to copy"}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </>
}

export default Lobby