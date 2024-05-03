const { Schema, model } = require('mongoose')

const checkinSchema = new Schema({
    student: {type: Schema.Types.ObjectId, ref: 'Student', required: true},
    checkout: {type: Date, default: null},
    checkedBy: {type: String, default: 'SMART Reception'},
}, {timestamps: true})

module.exports = model('Checkin', checkinSchema)