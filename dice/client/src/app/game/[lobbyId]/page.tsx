'use client'
import { FC, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { io } from 'socket.io-client'
import PlayerIcons from '@/components/PlayerIcons'
import Die from '@/components/Die'
import Dice from '@/components/Dice'

const socket = io('http://localhost:3001', {
  transports: ["websocket", "polling"],
})

const Page: FC = () => {
  const lobbyId = usePathname().split('/')[2]
  const [playerList, setPlayerList] = useState<PlayerGameState[]>(Array(Math.max(6)).fill({
    id: 12,
    name: "Player",
    icon: "/crew4.png",
    dice: [1,2,3,4,5],
    turn: false,
    target: {}
  }))
  // const [lobbySettings, setLobbySettings] = useState<Lobby>(); //maybe not needed and can just send via socket
  const [dice, setDice] = useState<number[]>([])
  const [amountSelection, setAmountSelection] = useState<number[]>([4,5,6])
  const [diceSelected, setDiceSelected] = useState<number>()
  const [amountSelected, setAmountSelected] = useState<number>()
  const [turnHistory, setTurnHistory] = useState()

  useEffect(() => {
    setDice(Array.from({length: 5}, () => Math.floor(Math.random() * 6) + 1))
  }, [])

  // const handleRoll = () => {
  //   setDice(Array.from({length: 5}, () => Math.floor(Math.random() * 6) + 1))
  // }

  useEffect(() => {
    
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
      <div className="absolute text-center" style={playerStyles}>
        <h2 className='caret-transparent'>{player.name}</h2>
        <PlayerIcons 
            icon={player.icon}
            size={50}
            //target <= opacity 50 all except current player + target(s)
        />
      </div>
      <div className='absolute' style={diceStyles}>
          <Dice 
            dice = {player.dice}
            reveal = {true}
            size = {20}
          />
      </div>  
    </div> 
  }

  const players = playerList.map((player, index) => (
    calculatePosition(player, index)
  ))
  
  return <>
    {/* BOARD */}
    <div className='relative w-[600px] h-[321px] border-[12px] rounded-[150px] border-red mx-auto mt-24'>
      {players}
    </div>

    {/* MIDDLE SECTION */}
    <div>
      <div className='fixed bottom-[80px] left-2/4 -translate-x-2/4 bg-red rounded-lg p-1 -mb-1'>
        <button className='w-[60px] h-[60px] border-2 border-black bg-white rounded-md' onClick={() => setAmountSelected(amountSelection[0])}>
          <h2 className='text-black text-4xl font-bold'>{amountSelection[0]}</h2>
        </button>
        <button className='w-[60px] h-[60px] mx-1 border-2 border-black bg-white rounded-md' onClick={() => setAmountSelected(amountSelection[1])}>
          <h2 className='text-black text-4xl font-bold'>{amountSelection[1]}</h2>
        </button>
        <button className='w-[60px] h-[60px] border-2 border-black bg-white rounded-md' onClick={() => setAmountSelected(amountSelection[2])}>
          <h2 className='text-black text-4xl font-bold'>{amountSelection[2]}</h2>
        </button>
      </div>
      <div className='fixed bottom-[0] left-2/4 -translate-x-2/4 bg-red rounded-lg pt-1'>
        <button className='mx-1' onClick={() => setDiceSelected(1)}>
          <Die 
            face={1}
            size={60}
            reveal={true}
            customStyle={{filter: "drop-shadow(3px 3px 0px #000)"}}
          />
        </button>
        <button className='mx-1' onClick={() => setDiceSelected(2)}>
          <Die 
            face={2}
            size={60}
            reveal={true}
            customStyle={{filter: "drop-shadow(3px 3px 0px #000)"}}
          />
        </button>
        <button className='mx-1' onClick={() => setDiceSelected(3)}>
          <Die 
            face={3}
            size={60}
            reveal={true}
            customStyle={{filter: "drop-shadow(3px 3px 0px #000)"}}
          />
        </button>
        <button className='mx-1' onClick={() => setDiceSelected(4)}>
          <Die 
            face={4}
            size={60}
            reveal={true}
            customStyle={{filter: "drop-shadow(3px 3px 0px #000)"}}
          />
        </button>
        <button className='mx-1' onClick={() => setDiceSelected(5)}>
          <Die 
            face={5}
            size={60}
            reveal={true}
            customStyle={{filter: "drop-shadow(3px 3px 0px #000)"}}
          />
        </button>
        <button className='mr-2 ml-1' onClick={() => setDiceSelected(6)}>
          <Die 
            face={6}
            size={60}
            reveal={true}
            customStyle={{filter: "drop-shadow(3px 3px 0px #000)"}}
          />
        </button>
      </div>
    </div>

    {/* RIGHT SECTION */}
    <div className='fixed bottom-0 left-3/4 -translate-x-2/4 -mb-12'>
      <Dice
        dice = {dice}
        reveal = {true}
        size = {80} 
      />
    </div>
    {/* <button onClick={handleRoll}> </button> */}

    {/* LEFT SECTION */}
    <div>
      
    </div>
  </>
}
export default Page