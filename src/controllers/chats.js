const Chat = require('../models/chat')
const Message = require('../models/message')
const Member = require('../models/member')
const Student = require('../models/student')
const fetchChatMembers = require('../services/fetchChatMembers')

const getNewMessagesCount = async (req, res) => {
    try {
        const chats = await Chat.find({
            members: {$in: req.userId},
        }).populate({
            path: 'lastMessage',
            select: 'seenBy message'
        })

        let chatIds = []

        chats.forEach(chat => {
            if (chat.lastMessage && !chat.lastMessage.seenBy.includes(req.userId)) {
                chatIds.push(chat._id)
            }
        })

        res.status(200).json({chatIds})
    } catch (e) {
        console.log(e)
    }
}

const getChats = async (req, res) => {
    try {
        const chats = await Chat.find({members: {$in: req.userId}}).sort({updatedAt: -1})
            .populate({
                path: 'lastMessage',
                select: '-seenBy',
                populate: {
                    path: 'sender',
                    select: 'fullName'
                }
            })

        const modified = await Promise.all(
            chats.map(async (chat) => {
                const members = await fetchChatMembers(chat.members)

                const newMessagesCount = await Message.countDocuments({
                    seenBy: {$nin: req.userId},
                    chat: chat.id
                })

                return {...chat.toObject(), members, newMessagesCount}
            })
        )

        res.status(200).json({chats: modified})
    } catch (e) {
        console.log(e)
    }
}

const getChatsOfGroup = async (req, res) => {
    try {
        const {id} = req.params
        const chat = await Chat.findById(id)

        const chatObj = {...chat.toObject(), members: await fetchChatMembers(chat.members)}

        res.status(200).json({chat: chatObj})
    } catch (e) {
        console.log(e)
    }
}

const getChat = async (req, res) => {
    try {
        const {id} = req.params

        const groupChat = await Chat.findById(id)
            .populate({
                path: 'messages',
                model: 'Message',
                populate: {
                    path: 'sender'
                },
            })

        if (groupChat) {
            const chatObj = {...groupChat.toObject(), members: await fetchChatMembers(groupChat.members)}

            return res.status(200).json({chat: chatObj})
        } else {
            const chatForNotes = req.userId === id

            const chat = await Chat.findOne({
                members: {
                    $all: chatForNotes ? [id] : [req.userId, id],
                    $size: chatForNotes ? 1 : 2
                },
                type: chatForNotes ? 'notes' : 'private'
            }).exec()

            let chatObj = null

            if (chat) {
                chatObj = {...chat.toObject(), members: await fetchChatMembers(chat.members)}
            }

            res.status(200).json({chat: chatObj})
        }

    } catch (e) {
        console.log(e)
    }
}

const createChat = async (req, res) => {
    try {
        const {name, image, lastMessage} = req.body

        const newChat = new Chat({
            name,
            image
        })

        newChat.save()

        res.status(200).json({chat: newChat})
    } catch (e) {
        console.log(e)
    }
}

const markAsSeen = async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId, seenBy: { $ne: req.userId } });

        messages.forEach(async message => {
            message.seenBy.push(req.userId)
            await message.save()
        })

        res.status(200).json({status: 'ok'})
    } catch (e) {
        res.status(500).json({message: 'Server error'})
        console.log(e)
    }
}

const getSeenByMembersList = async (req, res) => {
    try {
        const {id} = req.params

        const message = await Message.findById(id).select('seenBy sender')

        if(message.sender.toString() === req.userId) {
            const seenByWithoutRequestingUser = message.seenBy.filter(id => id !== req.userId)
            const readMembers = await fetchChatMembers(seenByWithoutRequestingUser)

            return res.status(200).json(readMembers)
        }

        return res.status(403).json('You don`t have permissions to get this info')
    } catch (e) {
        console.log(e)
    }
}

module.exports = {getNewMessagesCount, getChats, getChatsOfGroup, getChat, createChat, markAsSeen, getSeenByMembersList}