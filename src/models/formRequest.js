const {Schema, model} = require('mongoose')
const mongoose = require("mongoose");

const formRequestSchema = new Schema({
    formId: {type: mongoose.Types.ObjectId},
    data: {type: Object, required: true},
    student: {type: mongoose.Types.ObjectId, default: null}
}, {timestamps: true})

module.exports = model('FormRequest', formRequestSchema)