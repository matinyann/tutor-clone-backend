const {Schema, model} = require('mongoose')

const memberSchema = new Schema({
    fullName: {type: String},
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    password: {type: String},
    role: {type: String, required: true, default: 'instructor'},
    phoneNumbers: [{type: String}],
    workplace: {type: String},
    avatar: {type: String},
}, {timestamps: true})

module.exports = model('Member', memberSchema)