const Group = require("../models/group")
const getDays = require("../utils/generateScheduleDates")
const Attendance = require("../models/attendance")

const generateGroupsAttendances = async (req, res) => {
    try {
        const groups = await Group.find()

        groups.forEach(async group => {
                const obj = {
                    note: null,
                    present: null,
                    excused: null,
                    disabled: false
                }

                const days = getDays({period: [group.startDate, group.endDate], weekdays: group.days.weekdays})

                const allAttendance = {}
                const dayAttendanceWithStudents = {}

                group.students.forEach(student => {
                    dayAttendanceWithStudents[student] = obj
                })

                days.forEach(day => {
                    allAttendance[day] = dayAttendanceWithStudents
                })

                const periods = []
                const arr = Object.entries(allAttendance)

                for (let i = 0; i < arr.length; i += 10) { // divide into periods
                    const chunk = arr.slice(i, i + 10);
                    periods.push(chunk);
                }

                const newAttendance = new Attendance({
                    attendanceMap: periods,
                    students: group.students
                })

                group.attendance = newAttendance._id

                await group.save()
                await newAttendance.save()
            }
        )
    } catch (e) {
        console.log(e);
    }
}

module.exports = generateGroupsAttendances