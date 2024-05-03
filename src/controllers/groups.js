const Group = require('../models/group')
const Member = require('../models/member')
const Student = require('../models/student')
const Attendance = require('../models/attendance')
const Course = require('../models/course')
const getStudentAttendance = require('../services/countStudentAttendance')
const {countAttendanceOfPeriods, countGroupAttendancePercentage} = require('../services/countGroupAttendance')
const {changeGroupSchedule} = require('../services/changeGroupSchedule')
const {createNotification} = require("../services/notifications");

const {setCachedData, getCachedData} = require('../redis')

const getGroups = async (req, res) => {
    try {
        let groups

        if (req.role === 'instructor') {
            groups = await Group.find({instructor: req.userId})
                .populate({
                    path: 'course',
                    model: 'Course'
                }).exec()
        } else if (req.role === 'manager') {
            groups = await Group.find()
                .populate({
                    path: 'course',
                    model: 'Course'
                }).exec()
        }

        res.status(200).json({groups})
    } catch (e) {
        console.log(e)
    }
}

const getGroupsByFilters = async (req, res) => {
    try {
        const filtersQuery = req.query
        const filters = {}

        for (const filter in filtersQuery) {
            if (req.role === 'instructor') {
                filters.instructor = req.userId
            }

            if (filtersQuery[filter]) {
                if (filter === 'instructor' && req.role !== 'instructor') {
                    filters[filter] = await Member.findById(filtersQuery[filter]).select('fullName')
                } else if (filter === 'name') {
                    filters[filter] = new RegExp(filtersQuery[filter], 'i')
                } else if (filter === 'course') {
                    filters[filter] = await Course.findById(filtersQuery[filter])
                } else {
                    filters[filter] = filtersQuery[filter]
                }
            }
        }

        // const gr = await getCachedData('groups')
        const gr = null

        if (gr && Object.keys(filters).length === 0) {
            console.log('key found')
            return res.status(200).json({groups: gr})
        } else {
            const groups = await Group.find(filters)
                .populate({
                    path: 'instructor',
                    select: 'fullName avatar'
                })
                .populate({
                    path: 'course',
                    model: 'Course'
                }).exec()

            console.log('no key')

            // setItem('groups', groups)

            res.status(200).json({groups})
        }
    } catch (e) {
        console.log(e)
    }
}

const getGroup = async (req, res) => {
    try {
        const {id} = req.params

        // const cachedData = await getCachedData(`group-${id}`)
        const cachedData = null

        if (cachedData) {
            if (req.role === 'manager' || req.userId === cachedData.instructor.toString()) {
                console.log('key found')
                return res.status(200).json({group: cachedData})
            } else {
                return res.status(403).json({message: 'access denied!'})
            }
        }


        const group = await Group.findById(id)
            .populate({
                path: 'attendance',
                populate: {
                    path: 'students',
                    model: 'Student',
                    select: 'fullName avatar'
                }
            })
            .populate({
                path: 'course'
            }).exec()

        const attendance = await Attendance.findById(group.attendance)

        const attendanceTotal = countAttendanceOfPeriods(attendance)
        attendance.total = attendanceTotal
        await attendance.save()

        group.attendancePercentage = await countGroupAttendancePercentage(group.attendance._id)
        group.attendance.total = attendanceTotal

        await group.save()

        if (req.role === 'manager' || req.userId === group.instructor.toString()) {
            // await setCachedData(`group-${id}`, group)
            return res.status(200).json({group})
        } else {
            return res.status(403).json({message: 'access denied!'})
        }

    } catch (e) {
        console.log(e)
    }
}

const getStudents = async (req, res) => {
    try {
        const {id} = req.params

        const group = await Group.findById(id)

        if (req.role !== 'manager') {
            if (req.userId !== group.instructor.toString()) {
                return res.status(403).json({message: 'access denied'})
            }
        }

        const students = await Promise.all(
            group.students.map(async (id) => await Student.findById(id))
        )

        const studentsArr = []

        for (const student in students) {
            const studentObj = students[student].toObject()
            studentObj.attendence = await getStudentAttendance(id, students[student].id)

            studentsArr.push(studentObj)
        }

        res.status(200).json({students: studentsArr})
    } catch (e) {
        console.log(e)
    }
}

const removeStudent = async (req, res) => {
    try {
        const {groupId, studentId} = req.params

        const group = await Group.findById(groupId)
        const student = await Group.findById(studentId)

        if (req.role !== 'manager') {
            if (req.userId !== group.instructor.toString()) {
                return res.status(403).json({message: 'access denied'})
            }
        }

        group.students.filter(studentId => studentId !== student.id)
        student.currentGroup = null

        group.save()
        student.save()

        res.status(200).json({})
    } catch (e) {
        console.log(e)
    }
}

const createGroup = async (req, res) => {
    try {
        if (req.role !== 'manager') return res.status(403).json({message: 'access denied'})

        const {name, instructors} = req.body

        const newGroup = new Group({
            name,
            instructors
        })

        newGroup.save()

        res.status(200).json({newGroup})
    } catch (e) {
        console.log(e)
    }
}

const closeGroup = async (req, res) => {
    try {
        if (req.role !== 'manager') return res.status(403).json({message: 'access denied'})

        const {id} = req.params

        const group = await Group.findById(id)

        group.status = 'closed'

        group.save()

        res.status(200).json({group})
    } catch (e) {
        console.log(e)
    }
}

const markAttendance = async (req, res) => {
    try {
        const {id} = req.params
        const {attendance: newAttendance, period, groupId} = req.body

        const attendance = await Attendance.findById(id)
        const group = await Group.findById(groupId)

        attendance.attendanceMap[period] = attendance.attendanceMap[period].map(day => {
            if (day[0] === newAttendance[0]) {
                return newAttendance
            }

            return day
        })

        const attendanceTotal = countAttendanceOfPeriods(attendance)

        attendance.total = attendanceTotal

        await Attendance.findByIdAndUpdate(id, attendance, {$new: true})

        group.attendancePercentage = await countGroupAttendancePercentage(id)

        await Group.findByIdAndUpdate(groupId, group, {$new: true})

        res.status(200).json({modifiedAttendanceMap: attendance.attendanceMap, total: attendanceTotal})
    } catch (e) {
        console.log(e)
    }
}

const changeWeekSchedule = async (req, res) => {
    try {
        const {id} = req.params
        const {data} = req.body

        const group = await Group.findById(id)

        const updatedDays = data.days

        for (const prop in data) {
            if (prop === 'days') {

            } else if (group[prop] !== data[prop]) {
                group[prop] = data[prop]
            }
        }

        const days = {
            weekdays: updatedDays.map(day => day.index),
            class: {}
        }

        updatedDays.forEach(day => {
            days.class[day.name] = `${day.start.hour}:${day.start.minutes}-${day.end.hour}:${day.end.minutes}`
        })

        group.days = days

        await Group.findByIdAndUpdate(id, group, {$new: true})

        await changeGroupSchedule(group.attendance, group.endDate, days.weekdays)

        createNotification(
            req.io,
            group.instructor.toString(),
            `Schedule changes in ${group.name}`,
            `There are some schedule changes in ${group.name}`,
            {
                link: `http://localhost:3000/groups/${id}/settings/schedule`
            }
        )

        res.status(200).json({group})
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    getGroups,
    getGroupsByFilters,
    getGroup,
    getStudents,
    createGroup,
    markAttendance,
    closeGroup,
    removeStudent,
    changeWeekSchedule
}