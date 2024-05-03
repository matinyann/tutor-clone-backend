const Message = require("../models/message");

const markAsSeenWebSocket = async (userId, chat, io) => {
    try {
        const messages = await Message.find({ chat, seenBy: { $ne: userId } });
        let messageIds = []

        messages.forEach(async message => {
            messageIds.push(message.id)

            message.seenBy.push(userId)
            await message.save()
        })

        io.to(`chat-${chat}`).emit('user_has_seen_messages', {userId, chatId: chat, messageIds})

        return {message: 'ok'}
    } catch (e) {
        console.log(e)
        return {message: 'Server error'}
    }
}

module.exports = markAsSeenWebSocket