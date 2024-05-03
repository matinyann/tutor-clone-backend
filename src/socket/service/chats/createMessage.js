const Chat = require("../../../models/chat")
const fetchChatMembers = require("../../../services/fetchChatMembers")
const Message = require("../../../models/message")
const fs = require("fs");
const path = require("path")
require('dotenv').config()

const SERVER_URL = process.env.SITE_URL

let preUploadedFilesPerUser = {}

const filePreUpload = async (data, cb) => {
    try {
        const {key} = data

        switch (data.type) {
            case 'pre_upload':
                if (!preUploadedFilesPerUser[key]) {
                    preUploadedFilesPerUser[key] = []
                }

                preUploadedFilesPerUser = {
                    ...preUploadedFilesPerUser,
                    [key]: [
                        ...preUploadedFilesPerUser[key],
                        data.file
                    ]
                }

                cb({chatId: data.chatId, userId: data.userId, uploadedFileId: data.file.id, status: 'uploaded'})

                break
            case 'delete_pre_uploaded_file':
                const {preUploadedId} = data
                const filtered = preUploadedFilesPerUser[key].filter(file => file.id !== preUploadedId)

                preUploadedFilesPerUser = {
                    ...preUploadedFilesPerUser,
                    [key]: filtered
                }

                break
            case 'cancel_pre_uploading':
                delete preUploadedFilesPerUser[key]

                break
        }

        console.log(preUploadedFilesPerUser)
    } catch (e) {
        console.log(e)
    }
}

const createMessage = async ({sender, room: chatId, message, role}, socket, cb, broadcast) => {
    try {
        const parsedChatId = chatId.split('chat-')[1]
        let chat = await Chat.findById(parsedChatId)
        let newChat = false
        let chatObj = null

        if (!chat) {
            const chatForNotes = parsedChatId === sender

            chat = await Chat.findOne({
                members: {
                    $all: chatForNotes ? [parsedChatId] : [sender, parsedChatId],
                    $size: chatForNotes ? 1 : 2
                },
                type: parsedChatId === sender ? 'notes' : 'private'
            })

            if (chat) console.log('got a private chat with members', chat._id)

            if (!chat) {
                const chatForNotes = parsedChatId === sender
                chat = new Chat({
                    type: chatForNotes ? 'notes' : 'private',
                    members: chatForNotes ? [sender] : [sender, parsedChatId],
                    messages: []
                })

                if (chatForNotes) {
                    chat.name = 'Saved Messages'
                }

                newChat = true

                console.log('created', chat._id)

                chatObj = {...chat.toObject(), newChat, members: await fetchChatMembers(chat.members)}
            }
        } else {
            console.log('got with actual id', chat._id)
            chatObj = {...chat.toObject(), newChat, members: await fetchChatMembers(chat.members)}
        }

        let newMessage

        // if there is an array of files or earlier uploaded files
        if (message.files.length || preUploadedFilesPerUser[`${parsedChatId}-${sender}`]) {
            let fileLinks = []

            // Both newly uploaded and earlier uploaded files
            const files = preUploadedFilesPerUser[`${parsedChatId}-${sender}`]

            for (const file in files) {
                const fileName = `public/${Date.now()}-${files[file].name}`
                const pathToFolder = path.join(__dirname, `../../../../${fileName}`)

                fileLinks.push(`${SERVER_URL}/${fileName}`)
                fs.writeFile(pathToFolder, files[file].fileData, (err) => {})
            }

            newMessage = new Message({
                sender,
                seenBy: [sender],
                message: message.text || '',
                files: fileLinks,
                onModel: role,
                chat: chat._id
            })

            delete preUploadedFilesPerUser[`${parsedChatId}-${sender}`]
        } else {
            newMessage = new Message({
                sender,
                seenBy: [sender],
                message: message.text,
                onModel: role,
                chat: chat._id
            })
        }

        chat.lastMessage = newMessage._id

        await chat.save()
        await newMessage.save()

        let newCreatedChat = null

        if (newChat) {
            socket.join(`chat-${chat.id}`)

            newCreatedChat = await Chat.findById(chat.id).populate({
                path: 'lastMessage',
                populate: {
                    path: 'sender',
                    select: 'avatar fullName'
                }
            })

            chatObj = {...newCreatedChat.toObject(), newChat, members: await fetchChatMembers(chat.members)}
        }

        const savedMessage = await Message.findById(newMessage.id)
            .populate({
                path: 'sender',
                select: 'fullName avatar'
            })

        const members = chat.members.map(objectId => objectId.toString())

        chatObj = {
            ...chatObj,
            lastMessage: savedMessage.toObject(),
            newMessagesCount: 1,
            messages: [savedMessage.toObject()]
        }

        cb({chat: chatObj, message: savedMessage.toObject(), newRoom: `chat-${chat.id}`})
        broadcast({members, sender, message: savedMessage, chat: chatObj})
    } catch
        (e) {
        console.log(e)
    }
}

module.exports = {filePreUpload, createMessage}