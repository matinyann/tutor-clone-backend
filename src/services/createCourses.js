const Member = require('../models/member')
const Student = require('../models/student')
const Group = require('../models/group')
const Course = require('../models/course')

const courses = [
    'Yoga',
    'Musical Instruments',
    'Management',
    'Dance',
    'Finances',
    'Programming',
    'Marketing',
    'Agriculture',
    'English',
    'Russian',
    'Chinese',
    'Drawing',
    'Vocal',
    'Sound Design',
    'Digital Drawing',
    'VR Fitness',
    'Performing Arts',
    'Mechanics'
]

const createCourses = async (req, res) => {
    try {
        courses.forEach(async course => {
            const instructor = await Member.findOne({fullName: new RegExp(course, 'i')})

            const newCourse = new Course({
                name: course,
                instructors: [instructor._id],
                activeGroups: [],
                activeStudents: [],
            })

            await newCourse.save()
        })

        res.status(200).json({  })
    } catch (e) {
        console.log(e)
    }
}

module.exports = { createCourses }