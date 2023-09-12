/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { FC, Suspense, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import { io } from 'socket.io-client'
import NewPlayer from '@/components/NewPlayer'
import Lobby from '@/components/Lobby'
import Game from '@/components/Game'
import Loading from './loading'
const socket = io('http://localhost:3001' || 'https://liars-dice-express-d026f352885a.herokuapp.com/', {
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
  const [clockwise, setClockwise] = useState<boolean>(true)
  const [restartCounter, setRestartCounter] = useState<number>(0)

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
        setText(prev => ({...prev, button: host ? "START GAME" : "READY"}))
        if (host) {
          let tempList = [...playerList] as PlayerStatus[]
          tempList.push({...lobbyData.host, id: socket.id, ready: false, filled: true, loaded: true})
          setPlayerList(tempList)
          setNewPlayerLoaded(true)
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
    socket.emit('add-new-player-to-playerList', socket.id)
    socket.on('get-and-update-playerList', (userId) => {
      if ((playerList.findIndex(player => player.id == userId) === -1) && playerList.length > 0) {
        let tempList = [...playerList] as PlayerStatus[]
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
        socket.emit('send-playerList-to-all', tempList)
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
        socket.emit('playerList', tempList)
      }
    })

    socket.on('set-ready', (userId) => {
      const index = playerList.findIndex(player => player.id == userId)
      if (index !== -1) {
        if (index == 0) { //host
          let tempList : PlayerGameState[]
          tempList = playerList.map((player, index) => ({...player,
            dice: Array.from({length: 5}, () => Math.floor(Math.random() * 6) + 1),
            turn: index === 0 ? true: false,
            reveal: false,
          }))
          socket.emit('finalise-lobby', tempList)
        } else {
          let tempList = [...playerList] as PlayerStatus[]
          tempList[index] = {...tempList[index], ready: !tempList[index].ready}
          setPlayerList(tempList)
          socket.emit('playerList', tempList)
        }
      }
    })

    socket.on('move-to-game-state', (list : PlayerGameState[]) => {
      setPlayerList(list)
      setAmountSelection([list.length, list.length + 1, list.length + 2])
      setStartGame(true)
    })

    /* ---- GAME FUNCTIONALITY ---- */
    socket.on('show-player-hand', (userId) => {
      let tempList = [...playerList] as PlayerGameState[]
      const index = tempList.findIndex(player => player.id === userId)
      tempList[index] = {...tempList[index], reveal: true}
      setPlayerList(tempList)
    })

    socket.on('show-player-rerolls', (userId, dice) => {
      let tempList = [...playerList] as PlayerGameState[]
      const index = tempList.findIndex(player => player.id === userId)
      tempList[index] = {...tempList[index], dice: dice}
      setPlayerList(tempList)
    })

    socket.on('player-turn', (guess) => {
      const playerIndex = playerList.findIndex(player => player.id === guess.player.id)
      const targetIndex = playerList.findIndex(player => player.id === guess.target.id)
      
      let tempList = [...playerList] as PlayerGameState[]
      if (targetIndex !== -1 && playerIndex != -1) {
        tempList[playerIndex] = {...tempList[playerIndex], turn: false}
        tempList[targetIndex] = {...tempList[targetIndex], turn: true}
      }

      if (turnHistory.length == 0) {
        if (playerIndex - targetIndex === -1 || playerIndex - targetIndex === playerList.length - 1) {
          setClockwise(true)
        } else {
          setClockwise(false)
        }
      }

      let tempHistory = [...turnHistory]
      if (tempHistory.length >= 4) {
        tempHistory.shift()
      }
      
      tempHistory.push(guess)
      setTurnHistory(tempHistory)
      setPlayerList(tempList)

      setDiceSelected(0)
      setAmountSelected(0)
      
      let amount = guess.amountCalled + (guess.diceNumber === 6 && 1)
      setAmountSelection([amount, amount + 1, amount + 2])
    })

    socket.on('restart-from-server', (startingIndex) => {
      console.log("RESTART")
      let tempList = playerList.map((player, index) => ({...player,
        dice: Array.from({length: 5}, () => Math.floor(Math.random() * 6) + 1),
        turn: index === startingIndex ? true: false,
        reveal: false
      }))
      setPlayerList(tempList)
      setAmountSelection([tempList.length, tempList.length + 1, tempList.length + 2])
      setDiceSelected(0)
      setAmountSelected(0)
      setTurnHistory([])
      setClockwise(true)
      setRestartCounter(prev => prev + 1)
    })

    /* ---- DISCONNECT FUNCTIONALITY ---- */
    socket.on('disconnect-all', () => {
      alert("Host Disconnected")
    })

    socket.on('remove-player', (userId) => {
      let tempList = [...playerList]
      const index = tempList.findIndex(player => player.id === userId)
      if (index !== -1) {
        tempList.splice(index, 1)
        socket.emit('playerList', tempList)
      }
    })

    return () => {
      socket.off('get-and-update-playerList')
      socket.off('playerList-from-server')
      socket.off('lobby-state-from-server')
      socket.off('finalise-player')
      socket.off('set-ready')
      socket.off('move-to-game-state')
      socket.off('show-player-hand')
      socket.off('show-player-rerolls')
      socket.off('disconnect-all')
    }
  }, [playerList])
   
  return <>
    {
      startGame == false ?
      <Suspense fallback={<Loading />}>
        <div>
        {newPlayerLoaded == false && playerList.length > 0 &&
          <NewPlayer 
          lobbyName={lobbySettings.lobbyName} 
          lobbyId={lobbySettings.lobbyId} 
          socket={socket} 
          updatePlayer={(bool : boolean) => setNewPlayerLoaded(bool)}
          index={playerList.length}
          />
        }
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
          key = {restartCounter}
          socket = {socket}
          playerList = {playerList as PlayerGameState[]}
          amountSelected = {amountSelected}
          turnHistory = {turnHistory}
          diceSelected = {diceSelected}
          setDiceSelected = {setDiceSelected}
          amountSelection = {amountSelection}
          setAmountSelected = {setAmountSelected}
          clockwise = {clockwise}
        />
      </Suspense>
    }
  </>
}

export default Page
