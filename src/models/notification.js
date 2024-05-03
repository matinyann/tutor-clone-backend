const {Schema, model} = require('mongoose')

const notificationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: "onModel"
    },
    onModel: {
        type: String,
        required: true,
        enum: ['Member', 'Student'],
        default: 'Member'
    },
    title: {type: String, required: true},
    message: {type: String, required: true},
    isRead: {type: Boolean, default: false},
    metadata: {type: Schema.Types.Mixed}
}, {timestamps: true})

module.exports = model('Notification', notificationSchema)