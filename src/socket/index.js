const express = require('express')
const cors = require("cors")
const app = express()
const api = require('../routes')
const {createMessage, filePreUpload, deletePreUploadedFile, cancelPreUploading} = require("./service/chats/createMessage");
const passSocket = require("../middleware/io");
const markAsSeenWebSocket = require("../services/markAsSeenWebSocket")
const {getChat, loadMoreMessages} = require("./service/chats/chats");
const {reactToMessage} = require("./service/chats/messageActions");

app.use(cors())
app.use(express.json({limit: '100mb'}))

const http = require('http').Server(app)

const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    },
    maxHttpBufferSize: 1e8 // 100 MB
})

app.use('/api', passSocket(io), api)

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId

    socket.join(`user-${userId}`)
    console.log(userId, 'joined')
    const rooms = io.sockets.adapter.rooms
    console.log(rooms)

    socket.on('join', ({room}) => {
        socket.join(room)

        console.log(socket.id, 'connected to', room)
        const rooms = io.sockets.adapter.rooms
        console.log(rooms)
    })

    socket.on('change_room', ({newRoom, prevRoom}) => {
        console.log(socket.id, 'user change room from', prevRoom, 'to', newRoom)

        socket.leave(prevRoom)
        socket.join(newRoom)

        const rooms = io.sockets.adapter.rooms
        console.log(rooms)
    })

    socket.on('leave_room', room => {
        socket.leave(room)

        console.log(socket.id, 'left', room)

        const rooms = io.sockets.adapter.rooms
        console.log(rooms)
    })

    socket.on('user_get_chat', async ({id, userId}, cb) => {
        const chat = await getChat(id, userId)

        cb(chat)
    })

    socket.on('load_more_messages', async ({lastMessageId, chatId}, cb) => {
        const earlierMessages = await loadMoreMessages(lastMessageId, chatId)

        cb(earlierMessages)
    })

    socket.on('new_chat_message_to_server', async ({sender, room, message, role}) => {
        const cb = ({chat, message, newRoom}) => {
            io.to(newRoom || room).emit('new_chat_message_to_clients_in_chat', {chat, message})
        }

        const broadcastMessageNotification = ({members, sender, message, chat}) => {
            members.forEach(member => {
                if(member !== sender) {
                    io.to(`user-${member}`).emit('new_chat_message_notification_to_client', {chat, message})
                }
            })
        }

        await createMessage({sender, room, message, role}, socket, cb, broadcastMessageNotification)
    })

    socket.on('mark_chat_message_as_seen', async (data) => {
        await markAsSeenWebSocket(data.userId, data.chat, io)
    })

    socket.on('react_to_message', async data => {
        const cb = ({room, messageId, messageReactions}) => {
            io.to(room).emit('user_reacted_to_message', {messageId, messageReactions})
        }

        await reactToMessage(data, cb)
    })

    socket.on('pre_upload_file', async data => {
        const cb = ({chatId, userId, uploadedFileId, status}) => {
            io.to(`user-${userId}`).emit('file_pre_upload_status', {chatId, userId, uploadedFileId, status})
        }

        await filePreUpload(data, cb)
    })

    socket.on('delete_pre_uploaded_file', async data => {
        await filePreUpload(data)
    })

    socket.on('cancel_pre_uploading', async data => {
        await filePreUpload(data)
    })

    socket.on('disconnect', () => {
        const rooms = io.sockets.adapter.rooms
        console.log('user disconnected')
        console.log(rooms)
    })
})

module.exports = {
    server: http,
    io
}