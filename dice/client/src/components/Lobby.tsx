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
  text: {
    button: string,
    reroll: string,
    initialAmount: string
  }
}

const Lobby: FC<LobbyProps> = ({playerList, lobbySettings, socket, text}) => {
    const [lobbyMap, setLobbyMap] = useState<JSX.Element[]>()
    const url = "https://liars-dice-pho-ng.vercel.app" + usePathname()
    const [copied, setCopied] = useState<boolean>(false)

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
            {lobbySettings?.spectator == true &&
            <div className='flex text-4xl w-64 m-auto p-3 bg-[#161616]'>
              <h2 className='text-4xl'>SPECTATE</h2>
              <div className='border-red border-4 rounded-full w-10 h-10 mx-auto'>
                <h2 className='text-2xl text-center font-bold'>2</h2>
              </div>
            </div>
            }
            <button onClick={handleClick} className='text-4xl border-red border-8 rounded-xl w-64 m-auto p-2'>{text.button ? text.button : "READY"}</button>
          </div>
        </div>

        <div className='relative w-5/12 h-[420px]'>
          <h2 className='text-4xl'>ROOM NAME: {lobbySettings?.lobbyName !== undefined ? lobbySettings.lobbyName : ""}</h2>
          <h2 className='text-4xl my-3'>INITIAL AMOUNT: {text.initialAmount}</h2>
          <h2 className='text-4xl'>RE-ROLL DICE: {text.reroll} </h2>
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