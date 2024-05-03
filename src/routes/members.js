const express = require('express')
const router = express.Router()

const {
    getInstructorNames, getInstructors,
    createNewMember, getMembers, getMember
} = require('../controllers/members')

router.get('/instructor-names', getInstructorNames)
router.get('/instructors', getInstructors)
router.get('/q', getMembers)

router.post('/members', createNewMember)
router.get('/member/:id', getMember)

module.exports = router