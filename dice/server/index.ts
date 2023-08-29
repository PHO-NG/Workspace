const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 3001
import { Server } from 'socket.io'

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
    openInvite: boolean
    spectator: boolean
    reroll: boolean
    host : Player
}

const lobbyData : Lobby[] = []; //list of lobbies with no host initialised

io.on('connection', (socket) => {
    console.log("user connected: " + socket.id)
    socket.emit('get-userId', (socket.id))
    /* ---- LOBBY SETTINGS ---- */
    
    socket.on('create-room', (lobby) => {
        lobbyData.push(lobby)
    })
    
    socket.on('find-lobby-on-server', (lobbyId) => {
        socket.join(lobbyId)
        // Find lobbyId in array full of lobbyIds (host should always find one)
        const lobbyIndex = lobbyData.findIndex(lobby => lobby.lobbyId === lobbyId)
        if (lobbyData[lobbyIndex].host.id === "") {
            lobbyData[lobbyIndex] = {...lobbyData[lobbyIndex], host: {...lobbyData[lobbyIndex].host, id: socket.id}}
            socket.emit('initilise-lobby', lobbyData[lobbyIndex], true)
        } else {
            socket.emit('initilise-lobby', lobbyData[lobbyIndex], false)
        }   
    });

    socket.on('update-playerList', (lobbyId, userId) => {
        socket.broadcast.to(lobbyId).emit('get-and-update-playerList', userId)
    })

    socket.on('playerList', (lobbyId, list) => {
        socket.broadcast.to(lobbyId).emit('playerList-from-server', list)
    })

    socket.on('join-lobby', (userData, lobbyId) => {
        socket.broadcast.to(lobbyId).emit('finalise-player', {...userData, id: socket.id})
    })

    socket.on('player-ready', (userId, lobbyId) => {
        io.to(lobbyId).emit('set-ready', userId)
    })

    /* ---- GAME SETTINGS ---- */
    socket.on('finalise-lobby', (playerList, lobbyId) => {
        io.to(lobbyId).emit('move-to-game-state', playerList)
    })

    socket.on('show-called', (lobbyId) => {
        io.to(lobbyId).emit('set-show-true')
    })

    socket.on('reveal-hand', (userId, lobbyId) => {
        io.to(lobbyId).emit('show-player-hand', userId)
    })

    socket.on('player-rolls', (userId, dice, lobbyId) => {
        io.to(lobbyId).emit('show-player-hand', userId, dice)
    })
    
    socket.on('disconnect', () => {
        socket.removeAllListeners();   
        const index = lobbyData.findIndex(lobby => lobby.host.id === socket.id)
        if (index != -1) {
            lobbyData.splice(index, 1)
        }
        console.log("user disconnected: " + socket.id)
        
    })
  })
 
server.listen(PORT, () => {
    console.log(`✔️ Server listening on port ${PORT}`)
})

