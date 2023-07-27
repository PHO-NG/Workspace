/* eslint-disable react/no-unescaped-entities */
import React from 'react'

export default function CreateLobby() {
  return (
    <form className='flex flex-col mx-96'>
      <div className='flex mx-5 my-2 w-auto'>
        <label className='text-3xl mr-5 whitespace-nowrap' htmlFor="room-name">ROOM NAME:</label>
        <input className='text-3xl bg-black border-2 w-96' type="text" id="room-name" name="room-name" />
      </div>

      <div className='flex px-5 py-2 bg-darkgray'>
        <label className='text-3xl whitespace-nowrap' htmlFor="initial">INITIAL AMOUNT:</label>
          <input className='m-auto' type="range" id="initial" name="initial" min="0" max="6" step="1"/>
      </div>

      <div className='flex mx-5 my-2'>
        <label className='text-3xl mr-5' htmlFor="reroll">RE-ROLL DICE:</label>
        <input type="checkbox" id="reroll" name="reroll"/>
      </div>

      <div className='flex px-5 py-2 bg-darkgray'>
        <label className='text-3xl mr-6' htmlFor="spectators">SPECTATORS:</label>
        <input type="checkbox" id="spectators" name="spectators" />
      </div>

      <div className='flex mx-5 my-2'>
        <label className='text-3xl mr-7' htmlFor="invite">OPEN INVITE:</label>
        <input type="checkbox" id="invite" name="invite" />
      </div>
      <button className='text-3xl' type="submit">CREATE LOBBY</button>
    </form>
  )
}