const { Schema, model } = require('mongoose')

const attendanceSchema = new Schema({
    attendanceMap: { type: Object },
    students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    total: { type: Object, required: true, default: {} }
}, { timestamps: true })

module.exports = model('Attendance', attendanceSchema)