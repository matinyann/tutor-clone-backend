const {Schema, model} = require('mongoose')

const formSchema = new Schema({
    name: {type: String},
    course: {type: String},
    slug: {type: String},
    image: {type: String},
    finished: {type: Boolean, default: false},
    successMessage: {type: String},
    body: {type: Array, default: []},
    accessible: {type: Boolean, default: false}
}, {timestamps: true})

module.exports = model('Form', formSchema)