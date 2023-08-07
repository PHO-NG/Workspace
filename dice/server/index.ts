const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 3001

import { Server } from 'socket.io'

let lobbyData = {};


const io = new Server(server, {
    cors: {
        origin: '*', //'https://localhost:3000'
    }
})

type Player = {
    id: string
    name: string
    icon: string
}

type Lobby = {
    lobbyId: string
    lobbyName: string
    initialAmount: number
    host: Player
    openInvite: boolean
    spectator: boolean
    reroll: boolean
    playerList?: Player[]
}

io.on('connection',  (socket) => {

    /* ---- LOBBY SETTINGS ---- */
    const userId = socket.id;
    console.log("NEW USER: " + userId)
    socket.emit('get-hostId', socket.id)
    
    socket.on('create-room', (data) => {
        lobbyData = data;
        socket.join(data.host.id);
    })

    socket.emit('get-lobby-data', lobbyData);

    socket.on('update-lobby-state', (data) => {
        lobbyData = data;
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
  })

server.listen(PORT, () => {
    console.log(`✔️ Server listening on port ${PORT}`)
})
