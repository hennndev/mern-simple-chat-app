const http = require('http')
const cors = require('cors')
const express = require('express')
const { Server } = require('socket.io')
const { addNewUser, getCurrentUser, removeUser } = require('./utils/users')
const formatMessage = require('./utils/formatMessage')
const app = express()

app.use(cors())
const server = http.createServer(app)
const io = new Server(server, {
    cors: 'https://mern-socket-simple-chat.herokuapp.com',
    methods: ['POST', 'GET']
})

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(__dirname + '/client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}

io.on('connection', (socket) => {
    socket.on('join', data => {
        const users = addNewUser({
            id: socket.id,
            ...data
        })
        socket.join(data.room)
        io.to(data.room).emit('displayed_users', users.filter(user => user.room === data.room))
        socket.emit('message', formatMessage({
            id: new Date().getTime(),
            sender: 'Admin',
            text: `${data.username}, welcome to ${data.room} chat!`
        }))
        socket.broadcast.to(data.room).emit('message', formatMessage({
            id: new Date().getTime(),
            sender: 'Admin',
            text: `${data.username} join a chat`
        }))
    })
    socket.on('send_message', (message) => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', formatMessage({
            id: new Date().getTime(),
            ...message
        }))
    })

    socket.on('disconnect', () => {
        const currentUser = getCurrentUser(socket.id)
        const users = removeUser(socket.id)
        io.to(currentUser?.room).emit('displayed_users', users.filter(user => user.room === currentUser?.room))
        socket.broadcast.to(currentUser?.room).emit('message', formatMessage({
            id: new Date().getTime(),
            sender: 'Admin',
            text: `${currentUser?.username} leave a chat`
        }))
    })
})

server.listen(process.env.PORT || 5000, () => console.log('Server has connected'))