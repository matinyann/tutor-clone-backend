const { Schema, model } = require('mongoose')
require('dotenv').config()

const DEFAULT_MATERIALS_IMAGE = process.env.DEFAULT_COURSE_IMAGE

const materialSchema = new Schema({
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true, default: 'interactive-book' },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    image: {type: String, default: DEFAULT_MATERIALS_IMAGE},
    access: {type: Boolean, default: true},
    autogenerate: {type: Boolean, default: false},
}, { timestamps: true })

module.exports = model('LearningMaterial', materialSchema)