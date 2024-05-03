const { Schema, model } = require('mongoose')

const townSchema = new Schema({
    name: { type: String, required: true, unique: true }
})

module.exports = model('Town', townSchema)