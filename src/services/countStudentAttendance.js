const Group = require('../models/group')
const Attendance = require('../models/attendance')
const moment = require('moment')

const countStudentAttendance = async (id, studentId) => {
    try {
        const group = await Group.findById(id)
        const attendanceObj = await Attendance.findById(group.attendance)

        let presentCount = 0
        let allCount = 0

        for (const periodIndex in attendanceObj.attendanceMap) {
            const currentPeriod = attendanceObj.attendanceMap[periodIndex]

            currentPeriod.forEach(day => {
                const studentsData = Object.entries(day[1])

                const now = new Date()
                const today = [now.getFullYear(), now.getMonth(), now.getDate()]
                const future = day[0].split('.').map(e => Number(e)).reverse().map((e, i) => i === 1 ? e -= 1 : e)

                studentsData.forEach(studentData => { // [ studentId, attendance for current date ]
                    const presence = studentData[1]

                    if (moment(today).diff(moment(future), 'days') < 0) return

                    if (studentData[0] === studentId) {
                        if (presence.present === true) {
                            presentCount++
                            allCount++
                        } else {
                            allCount++
                        }
                    }
                })
            })
        }

        return presentCount > 0 ? Math.round((presentCount / allCount) * 100) : 0
    } catch (e) {
        console.log(e)
    }
}

module.exports = countStudentAttendance