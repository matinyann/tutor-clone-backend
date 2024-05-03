const express = require('express')
const router = express.Router()

const {
    getGroups,
    getGroup,
    createGroup,
    getStudents,
    markAttendance,
    getGroupsByFilters,
    closeGroup,
    removeStudent,
    changeWeekSchedule,
} = require('../controllers/groups')

router.post('/', createGroup)

router.get('/', getGroups)
router.get('/q', getGroupsByFilters)
router.get('/:id', getGroup)

router.get('/:id/students', getStudents)
router.patch('/remove/:groupId/:studentId', removeStudent)

router.patch('/mark-attendance/:id', markAttendance)

router.patch('/close/:id', closeGroup)

router.patch('/change-week-schedule/:id', changeWeekSchedule)

module.exports = router