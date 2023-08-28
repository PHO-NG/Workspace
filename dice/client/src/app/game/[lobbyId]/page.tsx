/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { FC, Suspense, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import { io } from 'socket.io-client'
import NewPlayer from '@/components/NewPlayer'
import Lobby from '@/components/Lobby'
import Game from '@/components/Game'
import Loading from './loading'
const socket = io('http://localhost:3001', {
  transports: ["websocket", "polling"],
})

const Page: FC = () => {
  const lobbyId = usePathname().split('/')[2]
  const [lobbySettings, setLobbySettings] = useState<Lobby>({
    lobbyId: lobbyId,
    lobbyName: "",
    initialAmount: 0,
    openLobby: false,
    spectator: false,
    reroll: false
  });
  const [playerList, setPlayerList] = useState<PlayerStatus[] | PlayerGameState[]>([])

  /* ---- LOBBY STATES ---- */
  const [newPlayerLoaded, setNewPlayerLoaded] = useState<boolean>(false)
  const [startGame, setStartGame] = useState<boolean>(false)

  /* ---- GAME STATES ---- */
  const [amountSelection, setAmountSelection] = useState<number[]>([4,5,6])
  const [diceSelected, setDiceSelected] = useState<number>(0)
  const [amountSelected, setAmountSelected] = useState<number>(0)
  const [turnHistory, setTurnHistory] = useState<TurnHistory[]>([])
  

  /* ---- GET RID OF RERENDERING BUG ---- */
  const [text, setText] = useState({
    button: "",
    reroll: "",
    initialAmount: ""
  })

  /* ---- INITILISE LOBBY ---- */
  useEffect(() => {
    socket.emit('find-lobby-on-server', lobbyId)
    socket.on('initilise-lobby', (lobbyData, host) => {
      if (lobbySettings.lobbyName === "") {
        setLobbySettings(lobbyData)
        if (host) {
          let tempList = [...playerList] as PlayerStatus[]
          const index = playerList.findIndex(player => player.id === socket.id)
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
      }
    })

    if (lobbySettings != undefined) {
      setText(prev => ({...prev, 
        reroll: lobbySettings.reroll == true ? "ON" : "OFF", 
        initialAmount: lobbySettings.initialAmount == 1 ? "Dynamic": lobbySettings.initialAmount.toString()
      }))
    }

    return () => {
      socket.off('initilise-lobby')
    }  
  }, [lobbySettings])

  /* ---- UPDATE LIST WHEN ACTION OCCURS ---- */
  useEffect(() => {
    /* ---- LOBBY FUNCTIONALITY ---- */
    socket.emit('update-playerList', lobbyId, socket.id)

    socket.on('get-and-update-playerList', (userId) => {
      let tempList = [...playerList] as PlayerStatus[]
      if ((tempList.findIndex(player => player.id == userId) === -1)) {
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
    })

    socket.on('finalise-player', (userData) => {

      let tempList = [...playerList] as PlayerStatus[]
      const index = tempList.findIndex(player => player.id === userData.id)
      if (index !== -1) {
        tempList[index] = {...tempList[index], ...userData, loaded: true}
        setPlayerList(tempList)
        socket.emit('playerList', lobbyId, tempList)
      }
    })

    socket.on('set-ready', (userId) => {
      const index = playerList.findIndex(player => player.id == userId)
      if (index !== -1) {
        if (index == 0) { //host
          let tempList : PlayerGameState[]
          tempList = playerList.map((player, index) => ({
            id: player.id,
            name: player.name,
            icon: player.icon,
            dice: Array.from({length: 5}, () => Math.floor(Math.random() * 6) + 1),
            turn: index === 0 ? true: false,
            reveal: false,
            target: index === 1 ? true : false
          }))
          socket.emit('finalise-lobby', tempList, lobbyId)
        } else {
          let tempList = [...playerList] as PlayerStatus[]
          tempList[index] = {...tempList[index], ready: !tempList[index].ready}
          setPlayerList(tempList)
          socket.emit('playerList', lobbyId, tempList)
        }
      }
    })

    socket.on('move-to-game-state', (list) => {
      setPlayerList(list)
      let tempHistory = [...turnHistory] as TurnHistory[]
      tempHistory.push({
        player: list[0],
        target: list[1],
        amountCalled: 3,
        diceNumber: 4
      })
      tempHistory.push({
        player: list[1],
        target: list[0],
        amountCalled: 6,
        diceNumber: 6
      })
      setTurnHistory(tempHistory)
      setStartGame(true)
    })

    /* ---- GAME FUNCTIONALITY ---- */
    socket.on('show-player-hand', (userId) => {
      let tempList = [...playerList] as PlayerGameState[]
      const index = tempList.findIndex(player => player.id === userId)
      tempList[index] = {...tempList[index], reveal: true}
      setPlayerList(tempList)
    })

    return () => {
      socket.off('get-lobby-state')
      socket.off('lobby-state-from-server')
      socket.off('get-and-update-playerList')
      socket.off('playerList-from-server')
      socket.off('finalise-player')
      socket.off('set-ready')
      socket.off('move-to-game-state')
    }
  }, [playerList])
   
  return <>
    {
      startGame == false ?
      <Suspense fallback={<Loading />}>
        <div>
        {newPlayerLoaded == false && <NewPlayer lobbyName={lobbySettings.lobbyName} lobbyId={lobbySettings.lobbyId} socket={socket} updatePlayer={(bool : boolean) => setNewPlayerLoaded(bool)}/>}
        <Lobby 
          playerList = {playerList as PlayerStatus[]}
          lobbySettings = {lobbySettings}
          socket = {socket}
          text = {text}
        />
      </div>
      </Suspense>
      :
      <Suspense fallback={<Loading />}>
        <Game
          lobbyId = {lobbyId} 
          socket = {socket}
          playerList = {playerList as PlayerGameState[]}
          amountSelected = {amountSelected}
          turnHistory = {turnHistory}
          diceSelected = {diceSelected}
          setDiceSelected = {setDiceSelected}
          amountSelection = {amountSelection}
          setAmountSelected = {setAmountSelected}
        />
      </Suspense>
    }
  </>
}

export default Page
