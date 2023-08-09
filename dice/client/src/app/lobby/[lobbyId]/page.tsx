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
  const [lobbySettings, setLobbySettings] = useState<Lobby>();
  const [playerList, setPlayerList] = useState<PlayerStatus[]>(Array(6).fill({
    id: "",
    name: "",
    icon: "",
    ready: false,
    host: false,
    position: 0,
    filled: false,
    loaded: false
  }))
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [firstCheck, setFirstCheck] = useState<boolean>(false) //clear first useEffect
  // const [userId, setUserId] = useState<string>("")
  const [newPlayerLoaded, setNewPlayerLoaded] = useState<boolean>(false)
  const pathname = usePathname()
  /* ---- GET RID OF RERENDERING BUG ---- */
  const [text, setText] = useState({
    button: "",
    reroll: "",
  })

  /* ---- INITILISE LOBBY ---- */
  useEffect(() => {
    console.log("FIRST")
    socket.emit('initilise-hostId', (pathname.split('/')[2]))
    socket.on('initilise-lobby-host', async (lobbyData, hostId) => {
      setNewPlayerLoaded(true)
      let tempList = playerList
      tempList[lobbyData.host.position - 1] = {...lobbyData.host, id: hostId}
      setPlayerList(tempList)
      setLobbySettings({...lobbyData, host: {...lobbyData.host, id: hostId}})
      setText({
        button: socket.id == lobbySettings?.host.id ? "START GAME" : "READY",
        reroll: lobbySettings?.reroll == true ? "ON" : "OFF"
      })
    })
    setFirstCheck(true) 
      return () => {
        socket.off('initilise-lobby-host')
    }  
    
  }, [])
   /* ---- UPDATE LIST WHEN NEW PLAYER CONNECTS ---- */

  useEffect(() => {
    console.log("IM A NEW PLAYER GET ME IN")
    if (newPlayerLoaded == false && firstCheck) {
      console.log("IM IN!")
      socket.emit('join-lobby', (pathname.split('/')[2]))

      socket.on('get-lobby-state', () => {
        socket.emit('lobby-state', lobbySettings)
      })

      socket.on('lobby-state-from-server', (lobbyData) => {
        setLobbySettings(lobbyData)
        console.log(lobbyData)
      })

    //   socket.emit('update-playerList', (lobbySettings?.lobbyId, socket.id))

    //   socket.on('get-and-update-playerList', (userId) => {
    //     let tempList = playerList
    //     const nextAvailableIndex = tempList.findIndex(player => player.filled == false)
    //     if (nextAvailableIndex == -1) { //lobby is full
    //       //setSpectatorList(prev => prev.push())
    //     } else {
    //       tempList[nextAvailableIndex] = {...tempList[nextAvailableIndex], id: userId, position: nextAvailableIndex + 1, filled: true}
    //       setPlayerList(tempList)
    //       socket.emit('playerList', (lobbySettings?.lobbyId, playerList))
    //     }
    //   })

    //   socket.on('playerList-from-server', (list) => {
    //     setPlayerList(list)
    //   })
      // return () => {
      //   socket.off('get-lobby-state')
      //   socket.off('lobby-state-from-server')
      // }
    } else {
      console.log("FIRSTCHECK:" + firstCheck + ". newPlayerLoaded:" + newPlayerLoaded)
    }
  }, [lobbySettings])

 
  // useEffect(() => {
  //   console.log("SECOND! " + newPlayerLoaded)
  //   if (newPlayerLoaded == false) {
  //     socket.emit('join-lobby', socket.io, (pathname.split('/')[2]))

  //     socket.on('get-lobby-state', (userId) => {
  //       socket.emit('lobby-state', lobbySettings, playerList)
  //       let tempList = playerList
  //       const nextAvailableIndex = tempList.findIndex(player => player.filled == false)
  //       if (nextAvailableIndex == -1) { //lobby is full
  //         //setSpectatorList(prev => prev.push())
  //       } else {
  //         tempList[nextAvailableIndex] = {...tempList[nextAvailableIndex], id: userId, position: nextAvailableIndex + 1, filled: true}
  //       setPlayerList(tempList)
  //       socket.emit('lobby-state', lobbySettings, playerList)
  //       }
  //     })

  //     socket.on('lobby-state-from-server', (data) => {
  //       setPlayerList(data.playerList)
  //       setLobbySettings(data.lobbySettings)
  //     })

  //     return () => {
  //       socket.off('get-lobby-state')
  //       socket.off('lobby-state-from-server')
  //     }
      
  //   }
  // }, [newPlayerLoaded])

  
  

  /* ---- UPDATE LIST WHEN NEW PLAYER DOES ACTION ---- */
  useEffect(() => {
  //   socket.emit('update-lobby')

  //   socket.on('get-lobby-state', () => {
  //     socket.emit('lobby-state', {playerList}) // add {playerList, lobbySettings} when editting lobby settings is possible
  //   })

  //   socket.on('lobby-state-from-server', (data) => {
  //     setPlayerList(data)
  //   })

  //   // return () => {
  //   //   socket.off('get-lobby-state')
  //   //   socket.off('lobby-state-from-server')
  //   // }
  }, [playerList]) // [lobbySettings, playerList] when editting lobby settings is possible

  const handleClick = () => {
    // socket.on('get-userId', (id) => {
    //   const player = playerList.find(player => player.id == id)
    //   if (player) {
    //     player.ready = !player.ready
    //     let tempList = playerList
    //     tempList[player.position - 1] = player 
    //     setPlayerList(tempList)
    //   }
    // })
    // socket.emit('update-lobby')
    // return () => {
    //   socket.off('get-userId')
    // }
  }
  
  let lobby = playerList.map((player, index) => (
    <LobbyCard 
      {...player}
      key={index}
      loaded={player.loaded != undefined ? player.loaded : true}
    />
  ))

  return <>
    {lobbySettings?.initialAmount != undefined && <div>
      {/* <Title /> */}
      <Link href="/" className='absolute left-3 top-3'>EXIT</Link>
      {/* {newPlayerLoaded == false && <NewPlayer lobbyName={lobbySettings?.lobbyName || ""} lobbyId={lobbySettings?.lobbyId || ""} socket={socket} newPlayerLoaded={newPlayerLoaded} onUpdate={() => setNewPlayerLoaded(true)}/>} */}
      <div className='flex justify-evenly'>
        <div className='flex flex-col w-5/12'>
          {lobby}
          <div className='flex justify-between w-10/12 mx-auto'>
            {lobbySettings?.spectator == true &&
            <div className='flex text-4xl w-64 m-auto p-3 bg-[#161616]'>
              <h2 className='text-4xl'>SPECTATE</h2>
              <div className='border-red border-4 rounded-full w-10 h-10 mx-auto'>
                <h2 className='text-2xl text-center font-bold'>2</h2>
              </div>
            </div>
            }
            {/* <button onClick={handleClick} className='text-4xl border-red border-8 rounded-xl w-64 m-auto p-2'>{"READY"}</button> */}
            <button onClick={handleClick} className='text-4xl border-red border-8 rounded-xl w-64 m-auto p-2'>{text.button}</button>
          </div>
        </div>

        <div className='w-5/12'>
          <h2 className='text-4xl'>ROOM NAME: {lobbySettings?.lobbyName}</h2>
          <h2 className='text-4xl my-3'>INITIAL AMOUNT: {lobbySettings?.initialAmount == 1 ? "Dynamic": lobbySettings?.initialAmount}</h2>
          <div className='flex'>
            <h2 className='text-4xl'>RE-ROLL DICE: {text.reroll} </h2>
          </div>
        </div>

      </div>
    </div>}
  </>
}

export default Page
