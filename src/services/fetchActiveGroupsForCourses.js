const Group = require('../models/group')
const Course = require('../models/course')

const fetchActiveGroupsForCourses = async () => {
    const courses = await Course.find()

    courses.forEach(async course => {
        const groups = await Group.find({course: course._id}).select('_id students')
        const allActiveStudents = []

        const ids = groups.map(group => {
            return group._id
        })

        const studentsOfGroups = groups.map(group => {
            return group.students
        })

        studentsOfGroups.forEach(studentsOfGroup => {
            studentsOfGroup.forEach(student => {
                allActiveStudents.push(student)
            })
        })

        course.activeGroups = ids
        course.activeStudents = allActiveStudents

        await course.save()
    })
}

module.exports = fetchActiveGroupsForCourses