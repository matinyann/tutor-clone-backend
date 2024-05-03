const Attendance = require('../models/attendance')
const moment = require('moment')

const countAttendanceOfPeriods = (attendance) => {
    const attendanceMap = attendance?.attendanceMap
    const students = attendance?.students

    const now = new Date()
    const today = [now.getFullYear(), now.getMonth(), now.getDate()]

    let result = {}

    const obj = {
        present: 0,
        absent: 0,
        excused: 0
    }

    for (const student in students) {
        result[students[student]._id] = obj
    }

    for (const period in attendanceMap) {
        const currentPeriod = attendanceMap[period]

        currentPeriod.forEach(day => {
            const arr = Object.entries(day[1])
            const future = day[0].split('.').map(e => Number(e)).reverse().map((e, i) => i === 1 ? e -= 1 : e)

            arr.forEach(student => {
                const studentId = student[0]
                const presence = student[1]

                if (presence.present === true) {
                    result = {
                        ...result,
                        [studentId]: {
                            ...result[studentId],
                            present: result[studentId].present + 1
                        }
                    }
                }
                if (presence.excused === true) {
                    result = {
                        ...result,
                        [studentId]: {
                            ...result[studentId],
                            excused: result[studentId].excused + 1,
                            absent: result[studentId].absent + 1,
                        }
                    }
                }
                if (!presence.excused === true && !presence.present === true) {
                    if (moment(today).diff(moment(future), 'days') >= 0) {
                        result = {
                            ...result,
                            [studentId]: {
                                ...result[studentId],
                                absent: result[studentId].absent + 1,
                            }
                        }
                    }
                }
            })
        })
    }

    return result
}

const countGroupAttendancePercentage = async (id) => {
    try {
        const attendanceObj = await Attendance.findById(id)

        let presentCount = 0
        let allCount = 0

        for (const periodIndex in attendanceObj.attendanceMap) {
            const currentPeriod = attendanceObj.attendanceMap[periodIndex]

            currentPeriod.forEach(day => {
                const arr = Object.entries(day[1])

                const now = new Date()
                const today = [now.getFullYear(), now.getMonth(), now.getDate()]
                const future = day[0].split('.').map(e => Number(e)).reverse().map((e, i) => i === 1 ? e -= 1 : e)

                arr.forEach(student => {
                    const presence = student[1]

                    if (moment(today).diff(moment(future), 'days') < 0) return

                    if (presence.present === true) {
                        presentCount++
                        allCount++
                    } else {
                        allCount++
                    }
                })
            })
        }

        return presentCount > 0 ? Math.round((presentCount / allCount) * 100) : 0
    } catch (e) {
        console.log(e)
    }
}

module.exports = { countAttendanceOfPeriods, countGroupAttendancePercentage }