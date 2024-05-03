const {Schema, model} = require('mongoose')

const messagesSchema = new Schema({
    message: {type: String},
    files: {type: Array, default: []},
    seenBy: {type: Array, required: true, default: []},
    chat: {type: Schema.Types.ObjectId, required: true, ref: "Chat"},
    sender: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: "onModel"
    },
    onModel: {
        type: String,
        required: true,
        enum: ['Member', 'Student']
    },
    reactions: {type: Object, default: {}}
}, {timestamps: true})

module.exports = model('Message', messagesSchema)