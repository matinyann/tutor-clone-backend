const { Schema, model } = require('mongoose')

const groupSchema = new Schema({
    name: { type: String, required: true, unique: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    instructor: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
    status: { type: String, default: 'active' },
    students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    days: { type: Object, required: true, default: {} },
    attendance: { type: Schema.Types.ObjectId, ref: 'Attendance' },
    attendancePercentage: { type: Number },
    startDate: { type: String, required: true, default: '2023-04-27' },
    endDate: { type: String, required: true, default: '2023-08-10' },
    lessonsCount: { type: Number, required: true, default: true },
    lessonDuration: { type: Number, required: true, default: 2 },
    periods: { type: Number, required: true, default: 3 },
    chat: { type: Schema.Types.ObjectId, ref: 'Chat' },
}, { timestamps: true })

module.exports = model('Group', groupSchema)