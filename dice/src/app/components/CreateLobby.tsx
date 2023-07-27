/* eslint-disable react/no-unescaped-entities */
import React from 'react'

export default function CreateLobby() {
  return (
    <form>
        <label htmlFor="room-name">Room name:</label>
        <input type="text" id="room-name" name="room-name" />

        <label htmlFor="initial">Initial Amount:</label>
        <input type="range" id="initial" name="initial" list="markers"/>
        <datalist id="markers">
          <option value="0">Dynamic</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </datalist>

        <label htmlFor="reroll">Re-roll dice:</label>
        <input type="checkbox" id="reroll" name="reroll" checked />

        <label htmlFor="spectators">Spectators:</label>
        <input type="checkbox" id="spectators" name="spectators" />
        
        <label htmlFor="invite">Open invite:</label>
        <input type="checkbox" id="invite" name="invite" />

        <button type="submit">Create Lobby</button>
    </form>
  )
}