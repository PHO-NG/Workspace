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
const HostIds : String[] = []

io.on('connection',  (socket) => {
    console.log("user connected: " + socket.id)
    socket.emit('get-userId', (socket.id))
    /* ---- LOBBY SETTINGS ---- */
    
    socket.on('create-room', (lobby) => {
        lobbyData.push(lobby)
    })
    
    socket.on('find-lobby-on-server', (lobbyId) => {
        socket.join(lobbyId)
        // Find lobbyId in array full of lobbyIds (host should always find one)
        const lobbyIndex = lobbyData.findIndex(lobby => lobby.lobbyId = lobbyId)
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

    socket.on('disconnect', () => {
        socket.removeAllListeners();   
        const index = lobbyData.findIndex(lobby => lobby.host.id = socket.id)
        if (index != -1) {
            lobbyData.splice(index, 1)
        }
        console.log('user disconnected')
    })
  })
 
server.listen(PORT, () => {
    console.log(`✔️ Server listening on port ${PORT}`)
})


/*
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
*/

