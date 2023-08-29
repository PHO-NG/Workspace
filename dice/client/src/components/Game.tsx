'use client'
import { FC, useState, useEffect, Suspense, MouseEventHandler } from 'react'
import Image from 'next/image'
import { Socket } from 'socket.io-client'

import PlayerIcons from '@/components/PlayerIcons'
import Die from '@/components/Die'
import Dice from '@/components/Dice'
import Loading from '@/app/game/[lobbyId]/loading'

interface GameProps {
  lobbyId: string
  socket: Socket
  playerList: PlayerGameState[]
  turnHistory: TurnHistory[]
  amountSelection: number[]
  diceSelected: number
  setDiceSelected: (arg0 : number) => void
  amountSelected: number
  setAmountSelected: (arg0 : number) => void
}

type PlayerDice = {
  dice: number[]
  reveal: boolean
}

const Game: FC<GameProps> = ({lobbyId, socket, playerList, turnHistory, amountSelection, amountSelected, setAmountSelected, diceSelected, setDiceSelected}) => {
  const [show, setShow] = useState<boolean>(false)
  const [dice, setDice] = useState<PlayerDice>({
    dice: [0,0,0,0,0],
    reveal: false
  })
  const [historyMap, setHistoryMap] = useState<JSX.Element[]>()

  const handleReveal = () => {
    if (show == false) {
      socket.emit('show-called', lobbyId)
    } else {
      socket.emit('reveal-hand', socket.id, lobbyId)
    }
  }
  
  useEffect(() => {
    const index = playerList.findIndex(player => player.id === socket.id)
    setDice({dice: playerList[index].dice, reveal: playerList[index].reveal})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerList]) //fix this later


  useEffect(() => {
    socket.on('set-show-true', () => {
      setShow(true)
    })

    return(() => {
      socket.off('set-show-true')
    })
  })

  const calculatePosition = (player: PlayerGameState, index : number) => {   
    let variance = playerList.length % 2 == 1 ? (index == 0 ? 0 : 20) : 0;
    const angle = (360 / playerList.length) *  Math.PI/180 * index
    const playerXPos = 260 + ((Math.sin(angle)) * 380)
    const playerYPos = (index == 0 ? 130 : 100) - (Math.cos(angle) * 230) + variance
    const playerStyles = {
      left: playerXPos,  
      top: playerYPos
    }
    const diceXPos = 235 + ((Math.sin(angle)) * 250)
    const diceYPos = (index == 0 ? 130 : 110) - (Math.cos(angle) * 115) + variance
    const diceStyles = {
      left: diceXPos,  
      top: diceYPos
    }
    return <div key={index}>
      <Suspense fallback={<Loading />}>
        <div className={`absolute text-center ${(player.target || player.turn) === false && 'opacity-30'}`} style={playerStyles}>
          <h2 className='caret-transparent'>{player.name}</h2>
          <PlayerIcons 
              icon={player.icon}
              size={50}
          />
        </div>
        
        <div className='absolute' style={diceStyles}>
            <Dice
              dice = {player.dice}
              reveal = {player.reveal}
              size = {20}
            />
        </div>
      </Suspense>
    </div> 
  }

  const players = playerList.map((player, index) => (
    calculatePosition(player, index)
  ))

  useEffect(() => {
    if (turnHistory.length > 0) {
      setHistoryMap(turnHistory.reverse().map((turn, index) => (
        <div className={`flex ${index === (turnHistory.length - 1) ? 'my-8' : "mt-3 opacity-50"}`} key={index}>
          <div className={`flex flex-col ml-auto text-center ${index !== (turnHistory.length - 1) && "-mr-28"}`}>
            <h2>{index === (turnHistory.length - 1) && turn.player.name}</h2>
              <PlayerIcons
                icon = {turn.player.icon}
                size = {index === (turnHistory.length - 1) ? 70 : 30}
              />
          </div>
          <div className='flex flex-col mx-auto'>
            <div className="flex -mb-12 mx-auto">
              <h2 className={`z-10 ${index === (turnHistory.length - 1) ? 'text-5xl mr-2' : 'text-2xl mr-1'} `}>{turn.amountCalled}</h2>
              <Die 
                face = {turn.diceNumber}
                size = {index === (turnHistory.length - 1) ? 50 : 30}
                reveal = {true}
              />
            </div>
            <Image 
              src={'/arrow3.png'}
              className={`mt-6 align-center ${index === (turnHistory.length - 1) && 'mx-2'}`}
              width={index === (turnHistory.length - 1) ? 300 : 100}
              height={0}
              alt={'/arrow3.png'}
              priority={true}
              placeholder={"blur"}
              blurDataURL={'/arrow3.png'}
            />
          </div>
          <div className={`flex flex-col mr-auto text-center ${index !== (turnHistory.length - 1) && "-ml-28"}`}>
            <h2>{index === (turnHistory.length - 1) && turn.target.name}</h2>
              <PlayerIcons
                icon = {turn.target.icon}
                size = {index === (turnHistory.length - 1) ? 70 : 30}
              />
          </div>
        </div>
      ))) 
    }
  }, [turnHistory])

  const handleRoll = () => {
    setDice(prev => ({...prev,
    dice: Array.from({length: 5}, () => Math.floor(Math.random() * 6) + 1)}))
    socket.emit('player-rolls', (socket.id, dice.dice, lobbyId))
  }

  return <>
  {/* BOARD */}
  <div className='relative w-[600px] h-[321px] border-[12px] rounded-[150px] border-red mx-auto mt-24'>
    {players}
    <button onClick={handleReveal} className='absolute left-2/4 -translate-x-2/4 bottom-2/4 translate-y-2/4 text-4xl border-red bg-red font-bold text-black tracking-wider select-none border-8 rounded-xl w-64 m-auto p-2'>{show ? "SHOW" : "CALL"}</button>
  </div>

  {/* MIDDLE SECTION */}
  <div className='relative mx-auto w-2/6'>
    <button className='absolute top-2/4 left-2/4 -translate-x-2/4 text-4xl border-red border-8 rounded-xl caret-transparent w-64 p-2'>TEST</button>
    <div className='fixed bottom-[80px] left-2/4 -translate-x-2/4 bg-red rounded-lg p-1 -mb-1'>
      <button className='w-[60px] h-[60px] border-2 border-black bg-white rounded-md' onClick={() => setAmountSelected(amountSelection[0])}
      style={amountSelected === amountSelection[0] ? {boxShadow: "inset 0 0 10px black", backgroundColor: "lightgray"} : {}}>
        <h2 className='text-black text-4xl font-bold'>{amountSelection[0]}</h2>
      </button>
      <button className='w-[60px] h-[60px] mx-1 border-2 border-black bg-white rounded-md' onClick={() => setAmountSelected(amountSelection[1])}
      style={amountSelected === amountSelection[1] ? {boxShadow: "inset 0 0 10px black", backgroundColor: "lightgray"} : {}}>
        <h2 className='text-black text-4xl font-bold'>{amountSelection[1]}</h2>
      </button>
      <button className='w-[60px] h-[60px] border-2 border-black bg-white rounded-md' onClick={() => setAmountSelected(amountSelection[2])}
      style={amountSelected === amountSelection[2] ? {boxShadow: "inset 0 0 10px black", backgroundColor: "lightgray"} : {}}>
        <h2 className='text-black text-4xl font-bold'>{amountSelection[2]}</h2>
      </button>
    </div>
    <div className='fixed bottom-[0] left-2/4 -translate-x-2/4 bg-red rounded-lg pt-1'>
      <button className='mx-1' onClick={() => setDiceSelected(1)} style={{filter: "drop-shadow(3px 3px 0px #000)"}}>
        <Die 
          face={1}
          size={60}
          reveal={true}
          diceStyle={diceSelected === 1 && {boxShadow: "inset 0 0 10px black", backgroundColor: "lightgray"}}
        />
      </button>
      <button className='mx-1' onClick={() => setDiceSelected(2)} style={{filter: "drop-shadow(3px 3px 0px #000)"}}>
        <Die 
          face={2}
          size={60}
          reveal={true}
          diceStyle={diceSelected === 2 && {boxShadow: "inset 0 0 10px black", backgroundColor: "lightgray"}}
        />
      </button>
      <button className='mx-1' onClick={() => setDiceSelected(3)} style={{filter: "drop-shadow(3px 3px 0px #000)"}}>
        <Die 
          face={3}
          size={60}
          reveal={true}
          diceStyle={diceSelected === 3 && {boxShadow: "inset 0 0 10px black", backgroundColor: "lightgray"}}
        />
      </button>
      <button className='mx-1' onClick={() => setDiceSelected(4)} style={{filter: "drop-shadow(3px 3px 0px #000)"}}>
        <Die 
          face={4}
          size={60}
          reveal={true}
          diceStyle={diceSelected === 4 && {boxShadow: "inset 0 0 10px black", backgroundColor: "lightgray"}}
        />
      </button>
      <button className='mx-1' onClick={() => setDiceSelected(5)} style={{filter: "drop-shadow(3px 3px 0px #000)"}}>
        <Die
          face={5}
          size={60}
          reveal={true}
          diceStyle={diceSelected === 5 && {boxShadow: "inset 0 0 10px black", backgroundColor: "lightgray"}}
        />
      </button>
      <button className='mr-2 ml-1' onClick={() => setDiceSelected(6)} style={{filter: "drop-shadow(3px 3px 0px #000)"}}>
        <Die
          face={6}
          size={60}
          reveal={true}
          diceStyle={diceSelected === 6 && {boxShadow: "inset 0 0 10px black", backgroundColor: "lightgray"}}
        />
      </button>
    </div>
  </div>

  {/* RIGHT SECTION */}
  <div className='fixed bottom-0 left-3/4 -translate-x-2/4 -mb-12'>
    <Dice
      dice = {dice.dice}
      reveal = {true}
      size = {80}
    />
  </div>
  {/* <button onClick={handleRoll}> </button> */}

  {/* LEFT SECTION */}
  <div className='fixed bottom-0 left-1/4 -translate-x-3/4'>
    {historyMap}
  </div>
  </>
}

export default Game