const {Schema, model} = require('mongoose')

const studentSchema = new Schema({
    firstName: {type: String},
    middleName: {type: String, default: null},
    lastName: {type: String,},
    fullName: {type: String},
    email: {type: String, unique: false},
    password: {type: String},
    role: {type: String, required: true, default: 'student'},
    phoneNumbers: [{type: String}],
    birthday: {type: Object},
    gender: {type: String, default: null},
    avatar: {type: String, default: null},
    status: {type: String, default: null},
    currentGroup: {type: Schema.Types.ObjectId, default: null},
    town: {type: Schema.Types.ObjectId, ref: 'Town'},
    smartBasics: {type: Object, default: {}},
    parentsFullNames: {type: Array, default: []},
    birthCertificate: {type: String, default: null}
}, {timestamps: true})

module.exports = model('Student', studentSchema)