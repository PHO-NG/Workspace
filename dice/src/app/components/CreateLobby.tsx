/* eslint-disable react/no-unescaped-entities */
'use client'
import {useState, useEffect } from 'react'
import Icon from '../components/PlayerIcons'

export default function CreateLobby() {
  const [counter, setCounter] = useState(0);

  const [data, setData] = useState({
    lobbyName: "",
    initialAmount: 1,
    reroll: true, 
    spectators: true, 
    openLobby: true,
    host: {
      name: "Host",
      icon: "/crew1.png",
    }
  })

  useEffect(() => {
    setData( prev => ({...prev, host: {...prev.host, icon: "/crew" + ((Math.abs(5 * counter) % 6 ) + 1) + ".png"}}))
  }, [counter])


  const handleSubmit = (e: any) => {
    e.preventDefault()
    setData(prev => ({
      lobbyName: e.target[0].value,
      initialAmount: e.target[1].value === 1 ? "Dynamic" : e.target[1].value,
      reroll: e.target[2].value, 
      spectators: e.target[3].value, 
      openLobby: e.target[4].value,
      host: prev.host
    }))
  }

  return (
    <div className="flex">
      <div className='flex flex-col w-3/12 mx-16'>
        <div className='flex mx-auto'>
          <button className='text-red text-7xl mx-5 font-bold' onClick={() => setCounter(count => count - 1)}>{"<"}</button>
          <Icon 
              icon={"/crew" + ((Math.abs(5 * counter) % 6 ) + 1) + ".png"}
              size={200}
          />
          <button className='text-red text-7xl mx-5 font-bold' onClick={() => setCounter(count => count + 1)}>{">"}</button>
        </div>
        <label className='text-3xl whitespace-nowrap mx-auto' htmlFor="nickName">NICKNAME:</label>
        <input className='text-3xl border-white mx-auto opacity-80 bg-black border-2 w-[60%] focus:outline-none focus:opacity-100' autoComplete="off" type="text" value={data.host.name} 
          onChange={(e) => setData( prev => ({...prev, host: {...prev.host, name: e.target.value}}))}
        />
      </div>

      <form className='flex flex-col mr-[20%] w-8/12' onSubmit={handleSubmit}>
        <div className='flex mx-5 my-2 w-auto'>
          <label className='text-3xl mr-10 whitespace-nowrap' htmlFor="lobbyName">ROOM NAME:</label>
          <input className='text-3xl border-white opacity-80 bg-black border-2 w-[60%] focus:outline-none focus:opacity-100' type="text" id="lobbyName" autoComplete="off" name="lobbyName" />
        </div>

        <div className='flex px-5 bg-darkgray'>
          <label className='text-3xl whitespace-nowrap mt-3' htmlFor="initialAmount">INITIAL AMOUNT:</label>
          <div className='w-7/12 ml-10'>
          <input className='ml- w-11/12' type="range" id="initialAmount" name="initialAmount" min="1" max="6" step="1" defaultValue="1" list="markers"/>

            <datalist className='-my-4 ml-7 w-11/12' id="markers">
              <option className="relative right-7" value="1" label='Dynamic'></option>
                <option className="" value="2" label='2'></option>
                <option className="" value="3" label='3'></option>
                <option className="" value="4" label='4'></option>
                <option className="" value="5" label='5'></option>
                <option className="" value="6" label='6'></option>    
            </datalist>
          </div>
        </div>

        <div className='flex mx-5 my-2'>
          <label className='text-3xl mr-5' htmlFor="reroll">RE-ROLL DICE:</label>
          <input className='hover:none' type="checkbox" id="reroll" name="reroll"/>
        </div>

        <div className='flex px-5 py-2 bg-darkgray'>
          <label className='text-3xl mr-6' htmlFor="spectators">SPECTATORS:</label>
          <input type="checkbox" id="spectators" name="spectators" />
        </div>

        <div className='flex mx-5 my-2'>
          <label className='text-3xl mr-7' htmlFor="openLobby">OPEN INVITE:</label>
          <input type="checkbox" id="openLobby" name="openLobby" />
        </div>
        <button className='text-3xl border-red border-8 rounded-lg w-64 m-auto py-3' type="submit">CREATE LOBBY</button>
      </form>
    </div>
    
  )
}