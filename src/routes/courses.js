const express = require('express')
const router = express.Router()
const {getCourses, getCourse, updateCourse, createCourse, getCourseNames} = require("../controllers/courses")
const upload = require("../middleware/upload");

router.post('/', createCourse)
router.get('/', getCourses)
router.get('/names', getCourseNames)
router.get('/:id', getCourse)
router.patch('/:id', upload('courses').single('image'), updateCourse)

module.exports = router