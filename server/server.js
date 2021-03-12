const express = require('express')
const app = express()
const path = require('path')
const server = require('http').createServer(app)
const readline = require("readline");
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
  });
const porta = process.env.PORT || 8080


const Player = require("./player.js")


let users = []

io.on('connection', socket => {
    //Criando um novo usuario caso não exista
    socket.on('openConnect', () => {
        socket.join(`vilarego`)
        socket.emit("loadUsers", users)
        if(!users.find(e => e.id == socket.id)){
            const newUser = new Player(socket.id)
            users.push(newUser)
            console.log(`Novo usuario ${socket.id}`)
            io.sockets.in(`vilarego`).emit('newUser', newUser)
            socket.emit('myId', socket.id)
            socket.emit('myPos', {x: newUser.posX, y: newUser.posY})
        }
    })
    socket.on('newPosition', (data) => {
        const found = users.find(e => e.player == socket.id)
        if(found){
            const id = users.indexOf(found)
            users[id].posX = data.posicaoBonecoX
            users[id].posY = data.posicaoBonecoY
            users[id].positionBoneco = data.positionBonecoX
            io.sockets.in(`vilarego`).emit('moveChar', users[id])
        }
    })
    //Fechando conexão
    socket.on('disconnect', () => {
        const found = users.find(e => e.player == socket.id)
        if(found){
            const id = users.indexOf(found)
            users.splice(id, 1)
            io.sockets.in(`vilarego`).emit('loadUsers', users)
        }
    })
})

server.listen(porta, () => {
    console.log(`Aberto na ${porta}`)
});