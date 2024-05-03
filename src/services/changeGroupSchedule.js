const Attendance = require('../models/attendance')
const moment = require('moment')
const generateScheduleDates = require('../utils/generateScheduleDates')

const changeGroupSchedule = async (id, endDate, dayIndexes) => {
    const now = new Date()
    const today = [now.getFullYear(), now.getMonth(), now.getDate()]

    const attendance = await Attendance.findById(id)
    const attendanceMap = attendance.attendanceMap

    const parsedDays = []

    attendanceMap.forEach((period, periodIndex) => {
        period.forEach((day, dayIndex) => {
            const future = day[0].split('.').map(e => Number(e)).reverse().map((e, i) => i === 1 ? e -= 1 : e)

            if (isNaN(moment(today).diff(moment(future), 'days')) || moment(today).diff(moment(future), 'days') < 0) {

            } else {
                parsedDays.push(day)
            }
        })
    })

    const lastLessonDay = parsedDays.length > 0 && parsedDays[parsedDays.length - 1][0]
        .replaceAll('.', '-')
        .split('-')
        .reverse()
        .join('-')

    const modifiedPeriods = createDaysAndAttendance({ attendance, parsedDays, startDate: lastLessonDay, endDate, dayIndexes })

    attendance.attendanceMap = modifiedPeriods

    await attendance.save()
}

const createDaysAndAttendance = ({ attendance, parsedDays = [], startDate, endDate, dayIndexes }) => {
    const obj = {
        note: null,
        present: null,
        excused: null,
        disabled: false
    }

    const days = generateScheduleDates({ period: [startDate, endDate], weekdays: dayIndexes })

    const allAttendance = {}
    const dayAttendanceWithStudents = {}

    attendance.students.forEach(student => {
        dayAttendanceWithStudents[student] = obj
    })

    days.forEach(day => {
        allAttendance[day] = dayAttendanceWithStudents
    })

    const periods = []
    const arr = [...parsedDays, ...Object.entries(allAttendance)]

    for (let i = 0; i < arr.length; i += 10) {
        const chunk = arr.slice(i, i + 10)
        periods.push(chunk)
    }

    return periods
}

module.exports = { changeGroupSchedule }