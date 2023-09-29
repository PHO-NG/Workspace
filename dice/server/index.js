const express = require('express')
const http = require('http')
const cors = require('cors')
const socketio = require('socket.io')

const router = require('./router')
const PORT = process.env.PORT || 3001

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(cors());
app.use(router);

let lobbyData = []

io.on('connection', (socket) => {
    let currentRoomId
    let currentHostId
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
            currentHostId = socket.id
            io.to(currentHostId).emit('initilise-lobby-host', lobbyData[lobbyIndex])
            lobbyData.splice(lobbyIndex, 1)
        } else {
            socket.broadcast.to(currentRoomId).emit('initilise-lobby-player', socket.id)
        }
    })

    socket.on('send-lobby-data', (lobbyData, hostId, userId) => {
        currentHostId = hostId
        io.to(userId).emit('receive-lobby-data', lobbyData)
    })

    socket.on('add-new-player-to-playerList', (userId) => {
        socket.broadcast.to(currentRoomId).emit('get-and-update-playerList', userId)
    })

    socket.on('reject-player', (userId) => {
        io.to(userId).emit('lobby-full')
    })

    socket.on('send-playerList-to-all', (list) => {
        socket.broadcast.to(currentRoomId).emit('playerList-from-server', list)
    })

    socket.on('playerList', (list) => {
        io.to(currentRoomId).emit('playerList-from-server', list)
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
        io.to(currentRoomId).emit('remove-player', socket.id)
        console.log("user disconnected: " + socket.id)
        console.log("currenthost: " + currentHostId)

        
    })
  })

server.listen(PORT, () => {
    console.log(`✔️ Server listening on port ${PORT}`)
})