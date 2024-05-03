const Message = require('../../../models/message')

const reactToMessage = async (data, cb) => {
    try {
        const {messageId, userId, reactionCode} = data

        const message = await Message.findById(messageId)

        let messageReactions = message.reactions

        if(!messageReactions[reactionCode]) {
            messageReactions[reactionCode] = []
        }

        for(key in messageReactions) {
            if(key === reactionCode) {
                if(!messageReactions[reactionCode].includes(userId)) {
                    messageReactions = {
                        ...messageReactions,
                        [reactionCode]: [...messageReactions[reactionCode], userId]
                    }
                } else {
                    messageReactions = {
                        ...messageReactions,
                        [reactionCode]: messageReactions[reactionCode].filter(id => id !== userId)
                    }
                }
            } else {
                messageReactions = {
                    ...messageReactions,
                    [key]: messageReactions[key].filter(id => id !== userId)
                }
            }
        }

        message.reactions = messageReactions

        await message.save()

        cb({room: `chat-${message.chat.toString()}`, messageId: message.id, messageReactions})
    } catch (e) {
        console.log(e)
    }
}

module.exports = {reactToMessage}