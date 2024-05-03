const { Schema, model } = require('mongoose')
require('dotenv').config()

const DEFAULT_COURSE_IMAGE = process.env.DEFAULT_COURSE_IMAGE

const courseSchema = new Schema({
    name: { type: String, required: true, unique: true },
    image: {type: String, default: DEFAULT_COURSE_IMAGE},
    instructors: [{type: Schema.Types.ObjectId, ref: 'Member'}],
    activeGroups: [{type: Schema.Types.ObjectId, ref: 'Group'}],
    activeStudents: [{type: Schema.Types.ObjectId, ref: 'Student'}],
    access: {type: Boolean, default: true},
    labels: {type: String, default: ''},
    details: {type: String, default: ''},
})

module.exports = model('Course', courseSchema)