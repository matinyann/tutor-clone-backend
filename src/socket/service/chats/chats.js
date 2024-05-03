const Chat = require("../../../models/chat")
const Message = require('../../../models/message')
const fetchChatMembers = require("../../../services/fetchChatMembers")

const loadMoreMessages = async (lastMessageId, chatId) => {
    try {
        const filters = {_id: {$lt: lastMessageId}, chat: chatId}

        const earlierMessages = await Message.find(filters)
            .sort({_id: -1})
            .limit(30)
            .populate({
                path: 'sender',
                select: 'avatar fullName role'
            })

        const latestMessage = earlierMessages[earlierMessages.length - 1]

        const earlierMessagesExist = latestMessage && await Message.count(filters)

        return {messages: earlierMessages.reverse(), mayFetchMore: !!earlierMessagesExist}
    } catch (e) {
        console.log(e);
    }
}

const getLastThirtyMessages = async (chatId) => {
    try {
        const last_30_messages = await Message.find({chat: chatId})
            .sort({_id: -1})
            .limit(30)
            .populate({
                path: 'sender',
                select: 'avatar fullName role'
            })

        const latestMessageId = last_30_messages[last_30_messages.length - 1]?.id

        const earlierMessagesExist = latestMessageId && await Message.count({_id: {$lt: latestMessageId}, chat: chatId})

        return {messages: last_30_messages.reverse(), mayFetchMore: !!earlierMessagesExist}
    } catch (e) {
        console.log(e)
    }
}

const getChat = async (id, userId) => {
    try {
        const groupChat = await Chat.findById(id)

        if (groupChat) {
            const chatObj = {...groupChat.toObject(), members: await fetchChatMembers(groupChat.members)}
            const last_30_messages = await getLastThirtyMessages(groupChat.id)

            return {chat: chatObj, messagesData: last_30_messages}
        } else {
            const chatForNotes = userId === id

            const chat = await Chat.findOne({
                members: {
                    $all: chatForNotes ? [id] : [userId, id],
                    $size: chatForNotes ? 1 : 2
                },
                type: chatForNotes ? 'notes' : 'private'
            })

            let chatObj = null
            let last_30_messages = null

            if (chat) {
                chatObj = {...chat.toObject(), members: await fetchChatMembers(chat.members)}
                last_30_messages = await getLastThirtyMessages(chat.id)
            }

            return {chat: chatObj, messagesData: last_30_messages}
        }
    } catch (e) {
        console.log(e)
    }
}

module.exports = {getChat, loadMoreMessages}