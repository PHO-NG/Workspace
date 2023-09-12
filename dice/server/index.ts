const express = require('express')
const http = require('http')
const socketio = require('socketio')
const cors = require('cors')
const router = require('./router')

const PORT = process.env.PORT || 3001

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(cors())
app.use(router)

let lobbyData : Lobby[] = []; //list of lobbies with no host initialised

io.on('connection', (socket) => {
    let currentRoomId : string
    let currentHostId : string
    console.log("user connected: " + socket.id)
    socket.emit('get-userId', (socket.id))
    /* ---- LOBBY SETTINGS ---- */
    
    socket.on('create-room', (lobby) => {
        lobbyData.push(lobby)
    })
    
    socket.on('find-lobby-on-server', (lobbyId) => {
        socket.join(lobbyId)
        currentRoomId = lobbyId
        // Find lobbyId in array full of lobbyIds (host should always find one)
        const lobbyIndex = lobbyData.findIndex(lobby => lobby.lobbyId === lobbyId)
        if (lobbyIndex !== -1) {
            if (lobbyData[lobbyIndex].host.id === "") {
                lobbyData[lobbyIndex] = {...lobbyData[lobbyIndex], host: {...lobbyData[lobbyIndex].host, id: socket.id}}
                currentHostId = socket.id
                socket.emit('initilise-lobby', lobbyData[lobbyIndex], true)
            } else {
                currentHostId = lobbyData[lobbyIndex].host.id
                socket.emit('initilise-lobby', lobbyData[lobbyIndex], false)
            }   
        }
    })

    socket.on('add-new-player-to-playerList', (userId) => {
        socket.broadcast.to(currentRoomId).emit('get-and-update-playerList', userId)
    })

    socket.on('send-playerList-to-all', (list) => {
        socket.broadcast.to(currentRoomId).emit('playerList-from-server', list)
    })

    socket.on('playerList', (list) => {
        socket.broadcast.to(currentRoomId).emit('playerList-from-server', list)
    })

    socket.on('join-lobby', (userData) => {
        socket.broadcast.to(currentRoomId).emit('finalise-player', {...userData, id: socket.id})
    })

    socket.on('player-ready', (userId) => {
        io.to(currentRoomId).emit('set-ready', userId)
    })

    /* ---- GAME SETTINGS ---- */
    socket.on('finalise-lobby', (playerList) => {
        io.to(currentRoomId).emit('move-to-game-state', playerList)
    })

    socket.on('show-called', (userId) => {
        io.to(currentRoomId).emit('set-show-true', userId)
    })

    socket.on('reveal-hand', (userId) => {
        io.to(currentRoomId).emit('show-player-hand', userId)
    })

    socket.on('player-rolls', (userId, dice) => {
        io.to(currentRoomId).emit('show-player-rerolls', userId, dice)
    })

    socket.on('guess', (guess) => {
        io.to(currentRoomId).emit('player-turn', guess)
    })

    socket.on('restart', (index) => {
        io.to(currentRoomId).emit('restart-from-server', index)
    })
    
    socket.on('disconnect', () => {
        socket.removeAllListeners();   
        const index = lobbyData.findIndex(lobby => lobby.lobbyId === currentRoomId)
        if (index != -1) {
            if (lobbyData[index].host.id === socket.id) {
                lobbyData.splice(index, 1)
                io.in(currentRoomId).emit('disconnect-all')
                io.in(currentRoomId).disconnectSockets();
            } else {
                io.in(currentRoomId).emit('remove-player', socket.id)
            }
        }
        console.log("user disconnected: " + socket.id)
        
    })
  })

server.listen(PORT, () => {
    console.log(`✔️ Server listening on port ${PORT}`)
})