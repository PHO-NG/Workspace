'use client'
import { FC, useState, useEffect, Suspense, MouseEventHandler } from 'react'
import Image from 'next/image'
import { Socket } from 'socket.io-client'

import PlayerIcons from '@/components/PlayerIcons'
import Die from '@/components/Die'
import Dice from '@/components/Dice'
import Loading from '@/app/game/[lobbyId]/loading'
import TimerButton from './TimerButton/TimerButton'

interface GameProps {
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

const Game: FC<GameProps> = ({socket, playerList, turnHistory, amountSelection, amountSelected, setAmountSelected, diceSelected, setDiceSelected}) => {
  const [show, setShow] = useState<boolean>(false)
  const [curTurn, setCurTurn] = useState<boolean>()
  const [rerolled, setRerolled] = useState<boolean>(false)
  const [dice, setDice] = useState<PlayerDice>({
    dice: [0,0,0,0,0],
    reveal: false
  })
  const [historyMap, setHistoryMap] = useState<JSX.Element[]>()
  const [timer, setTimer] = useState<number>(0)
  const dieArr = [1,2,3,4,5,6]

  useEffect(() => {
    let index = playerList.findIndex(player => player.id === socket.id)
    setDice({dice: playerList[index].dice, reveal: playerList[index].reveal})
    index = playerList.findIndex(player => player.turn === true)
    setCurTurn(playerList[index].id === socket.id ? true : false)
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
    const playerXPos = 260 + ((Math.sin(angle)) * 380) - ((360 * index) / playerList.length > 200 ? 30 : 0)
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
        <div className={`absolute border border-red w-max text-center ${player.turn === false && 'opacity-30'}`} style={playerStyles}>
          <h2 className='caret-transparent text-center'>{player.name}</h2>
          <div className='relative mx-auto w-max'>
            <PlayerIcons 
                icon={player.icon}
                size={50}
            />
            {/* {rerolled == true && <div>
              <div className='absolute -left-10 top-0 w-32 h-5/6 border-x-4  border-red rounded-full'></div>
              <div className='absolute -left-113 top-0 w-40 h-5/6 border-x-6  border-red rounded-full'></div>
            </div>} */}
          </div>
          
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
              alt={'arrow'}
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

  const amountOptions = amountSelection.map(amount => (
    <button key={amount} className='w-[60px] h-[60px] mx-0.5 border-2 border-black bg-white rounded-md' onClick={() => setAmountSelected(amount)}
      style={amountSelected === amount ? {boxShadow: "inset 0 0 10px black", backgroundColor: "lightgray"} : {filter: "drop-shadow(3px 3px 0px #000)"}}>
        <h2 className='text-black text-4xl font-bold'>{amount}</h2>
      </button>
  ))

  const dieOptions = dieArr.map(die => (
    <button key={die} className='mx-1' onClick={() => setDiceSelected(die)}>
        <Die 
          face={die}
          size={60}
          reveal={true}
          customStyle={diceSelected !== die && {filter: "drop-shadow(3px 3px 0px #000)"}}
          diceStyle={diceSelected === die && {boxShadow: "inset 0 0 10px black", backgroundColor: "lightgray"}}
        />
      </button>
  ))

  const handleRoll = () => {
    const tempDice : number[] = Array.from({length: 5}, () => Math.floor(Math.random() * 6) + 1)
    setDice(prev => ({...prev,
    dice: tempDice}))
    socket.emit('player-rolls', socket.id, tempDice)
    setRerolled(true)
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (rerolled) {
        setRerolled(false)
      }}, 1000)
    return () => clearTimeout(timeout)
  }, [rerolled])

  const handleReveal = () => {
    if (show == false) {
      socket.emit('show-called')
    } else {
      socket.emit('reveal-hand', socket.id)
    }
  }


  return <>
  {/* BOARD */}
  <div className='relative w-[600px] h-[321px] border-[12px] rounded-[150px] border-red mx-auto mt-24'>
    {players}
    <button onClick={handleReveal} className='absolute left-2/4 -translate-x-2/4 bottom-2/4 translate-y-2/4 text-4xl border-red bg-red font-bold text-black tracking-wider select-none border-8 rounded-xl w-64 m-auto p-2'>{show ? "SHOW" : "CALL"}</button>
  </div>

  {/* MIDDLE SECTION */}
  <div className='fixed bottom-0 left-2/4 -translate-x-2/4'>
    <div>
      <TimerButton 
        duration={20}
        turn={curTurn ? curTurn : false}
      />
      {(amountSelected !== 0 && diceSelected !== 0) ? 
        <div className='absolute top-4 left-24 flex ml-8 mt-1'>
          <h2 className='text-4xl -ml-8'>GUESS:</h2>
          <h2 className='text-4xl ml-4 mr-2'>{amountSelected}</h2>
            <Die 
              face = {diceSelected}
              size = {45}
              reveal = {true}
              customStyle={{marginTop: "-2px"}}
            />
          {/* </div> */}
        </div>
        :
        <h2 className='absolute top-4 left-36 ml-2 mt-1 mx-auto text-4xl'>GUESS</h2>
      }
    </div>
    <div className='flex mx-auto w-min mt-10'>
      <h2 className='text-4xl text-white mt-6'>TARGET:</h2>
      <button className='text-red text-3xl ml-3 -mt-3 font-bold'>{"<"}</button>
      <div className='flex flex-col '>
        <div className='relative mx-auto'>
          <PlayerIcons 
            icon = {'/crew6.png'}
            size = {70}
          />
        </div>
        <h2 className='whitespace-nowrap'>TARGET NAME</h2>
      </div>
      <button className='text-red text-3xl mr-3 -mt-3 font-bold'>{">"}</button>
    </div>
    <div className='mx-auto bg-red flex w-min rounded-lg p-1 -mb-1 mt-6'>
      {amountOptions}
    </div>
    <div className='mx-auto mt-2 bg-red rounded-lg pt-1'>
      {dieOptions}
    </div>
  </div>

  {/* RIGHT SECTION */}
  <div className='fixed bottom-0 left-3/4 -translate-x-2/4 -mb-8'>
    <Dice
      dice = {dice.dice}
      reveal = {true}
      size = {80}
    />
    {show === false && <button onClick={handleRoll}> 
    {/* change to turnhistory == 0 when it starts working */}
      <Image 
        src={'/reroll.png'}
        className={'absolute top-1/4 -translate-y-1/4 left-1/2 -translate-x-2/4'}
        width={90}
        height={0}
        alt={'reroll'}
        priority={true}
        placeholder={"blur"}
        blurDataURL={'/reroll.png'}
      />
    </button>}
  </div>
  

  {/* LEFT SECTION */}
  <div className='fixed bottom-0 left-1/4 -translate-x-3/4'>
    {historyMap}
  </div>
  </>
}

export default Game