const express = require('express')
const router = express.Router()

const { getStudent, getStudentName, getStudentNameSuggestions, updateStudent, createStudent
} = require('../controllers/students')

router.get('/name/:id', getStudentName)
router.get('/:id', getStudent)
router.post('/suggest', getStudentNameSuggestions)
router.patch('/:id', updateStudent)
router.post('/new', createStudent)

module.exports = router