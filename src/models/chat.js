const {Schema, model} = require('mongoose')

const chatSchema = new Schema({
    name: {type: String},
    group: {type: Schema.Types.ObjectId, ref: 'Group'},
    type: {type: String},
    members: [{
        type: Schema.Types.ObjectId
    }],
    image: {type: String},
    lastMessage: {type: Schema.Types.ObjectId, ref: 'Message', default: null}
}, {
    timestamps: true
})

module.exports = model('Chat', chatSchema)