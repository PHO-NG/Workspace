/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Title from '@/components/Title/Title'
import LobbyCard from '@/components/LobbyCard'

import { io } from 'socket.io-client'
import NewPlayer from '@/components/NewPlayer'
const socket = io('http://localhost:3001', {
  transports: ["websocket", "polling"],
})


const Page: FC = () => {
  const lobbyId = usePathname().split('/')[2]
  const [lobbySettings, setLobbySettings] = useState<Lobby>();
  const [playerList, setPlayerList] = useState<PlayerStatus[]>([])
  const [lobbyMap, setLobbyMap] = useState<JSX.Element[]>()
  const [newPlayerLoaded, setNewPlayerLoaded] = useState<boolean>(false)
  const [lobbyFinalised, setLobbyFinalised] = useState<boolean>(false)
  

  /* ---- GET RID OF RERENDERING BUG ---- */
  const [text, setText] = useState({
    button: "",
    reroll: "",
    initialAmount: ""
  })

  /* ---- INITILISE LOBBY + HOST ---- */
  useEffect(() => {
    socket.emit('find-lobby-on-server', lobbyId)
    socket.on('initilise-lobby', (lobbyData, host) => {
      setLobbySettings({...lobbyData, lobbyId: lobbyId})
      if (host) {
        let tempList = [...playerList]
        const index = playerList.findIndex(player => player.id = socket.id)
        if (index === -1) {
          tempList.push({...lobbyData.host, id: socket.id, ready: false, filled: true, loaded: true})
        } 
        setPlayerList(tempList)
        setNewPlayerLoaded(true)
        setText(prev => ({...prev, button: "START GAME"}))
      }
      else {
        setText(prev => ({...prev, button: "READY"}))
      }
    })

    if (lobbySettings != undefined) {
      setLobbyFinalised(true)
      setText(prev => ({...prev, 
        reroll: lobbySettings.reroll == true ? "ON" : "OFF", 
        initialAmount: lobbySettings.initialAmount == 1 ? "Dynamic": lobbySettings.initialAmount.toString()
      }))
    }

    return () => {
      socket.off('initilise-lobby')
    }  
  }, [lobbyFinalised])

   /* ---- UPDATE LIST WHEN NEW PLAYER CONNECTS ---- */

  useEffect(() => {
    socket.emit('update-playerList', lobbyId, socket.id)

    socket.on('get-and-update-playerList', (userId) => {
      if (playerList.findIndex(player => player.id == userId) === -1) {
        let tempList = [...playerList]
        console.log("ADDED")
        if (userId != null) {
          tempList.push({
            id: userId,
            name: "",
            icon: "",
            ready: false,
            filled: true,
            loaded: false
          })
        }
        setPlayerList(tempList)
        socket.emit('playerList', lobbyId, tempList)        
      }
    })

    socket.on('playerList-from-server', (list) => {
      setPlayerList(list)
      // setNewPlayerLoaded(true)
    })

    socket.on('finalise-player', (userData) => {
      let tempList = [...playerList]
      const index = tempList.findIndex(player => player.id == userData.id)
      if (index !== -1) {
        tempList[index] = {...tempList[index], ...userData, loaded: true}
        setPlayerList(tempList)
        socket.emit('playerList', lobbyId, tempList)
      }
    })

    socket.on('set-ready', (userId) => {
      let tempList = [...playerList]
      const index = tempList.findIndex(player => player.id == userId)
      if (index !== -1) {
        tempList[index] = {...tempList[index], ready: !tempList[index].ready}
        setPlayerList(tempList)
        socket.emit('playerList', lobbyId, tempList)
      }
    })

    console.log(playerList)
    return () => {
      socket.off('get-lobby-state')
      socket.off('lobby-state-from-server')
      socket.off('get-and-update-playerList')
      socket.off('playerList-from-server')
      socket.off('finalise-player')
      socket.off('set-ready')
    }
  }, [playerList])

  const handleClick = () => {
    socket.emit('player-ready', socket.id, lobbyId)

    //make a big socket.on('update-playerlist', (newUserData))
  }

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
   
  return <>
    {lobbySettings?.initialAmount != undefined && <div>
      <Title />
      <Link href="/" className='absolute left-3 top-3'>EXIT</Link>
      {newPlayerLoaded == false && <NewPlayer lobbyName={lobbySettings.lobbyName} lobbyId={lobbySettings.lobbyId} socket={socket} updatePlayer={(bool : boolean) => setNewPlayerLoaded(bool)}/>}
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
    </div>}
  </>
}

export default Page

