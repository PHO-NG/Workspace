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
    host: Player
    openInvite: boolean
    spectator: boolean
    reroll: boolean
    playerList?: Player[]
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
    
    socket.on('initilise-hostId', (lobbyId) => {
        console.log("check")
        socket.join(lobbyId)
        console.log('INIT ROOM. LOBBY ID: ' + lobbyId)
        // Find lobbyId in array full of lobbyIds (host should always find one)
        const lobbyIndex = lobbyData.findIndex(lobby => lobby.lobbyId = lobbyId)
        if (lobbyIndex != -1) {
            console.log("IM THE HOST NOW")
            socket.emit('initilise-lobby-host', lobbyData[lobbyIndex], socket.id)
            lobbyData.splice(lobbyIndex, 1)
        } else { //lobby has host already
            console.log("IM A PLAYER")
            socket.broadcast.to(lobbyId).emit('initilise-lobby-player')
        }
    });

    socket.on('lobby-state', (lobbySettings) => { //data isnt updated yet for this
        console.log(lobbySettings)
        socket.broadcast.to(lobbySettings.lobbyId).emit('lobby-state-from-server', lobbySettings)
        console.log("NEW PLAYER CALLING")
    })

    socket.on('update-playerList', (lobbyId, userId) => {
        socket.broadcast.to(lobbyId).emit('get-and-update-playerList', userId)
    })

    socket.on('playerList', (lobbyId, list) => {
        socket.broadcast.to(lobbyId).emit('playerList-from-server', list)
    })

    socket.on('disconnect', () => {
        socket.removeAllListeners();   
         
        console.log('user disconnected')
    })
  })


// io.on('connection',  (socket) => {
//     console.log("user connected: " + socket.id)
//     socket.emit('get-userId', (socket.id))
//     socket.on('create-room', (lobby) => {
//         lobbyData.push(lobby)
//         socket.join(lobby.host.id)
//     })
//     socket.on('initilise-hostId', (lobbyId) => {
//         socket.join(lobbyId)
//         // Find lobbyId in array full of lobbyIds (host should always find one)
//         const lobbyIndex = lobbyData.findIndex(lobby => lobby.lobbyId = lobbyId)
//         if (lobbyIndex != -1) {
//             socket.emit('initilise-lobby-host', lobbyData[lobbyIndex], socket.id)
//             lobbyData.splice(lobbyIndex, 1)
//         } else { //lobby has host already
//             console.log("HOST ALREADY LOCKED IN")
//         }
//     });

//     socket.on('join-lobby', ({userId, lobbyId}) => {
//         socket.join(lobbyId)
//         socket.broadcast.to(lobbyId).emit('get-lobby-state', userId)
//     })

//     socket.on('lobby-state', (lobbySettings, playerList) => {
//         socket.broadcast.to(lobbySettings.lobbyId).emit('lobby-state-from-server', lobbySettings, playerList)
//     })

//     socket.on('disconnect', () => {
//         socket.removeAllListeners();   
//         console.log('user disconnected')
//     })
//   })
  

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

