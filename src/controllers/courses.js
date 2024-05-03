const Group = require('../models/group')
const Course = require('../models/course')

const getCourseNames = async (req, res) => {
    try {
        const courses = await Course.find().select('name')

        res.status(200).json({courses})
    } catch (e) {
        console.log(e)
    }
}

const createCourse = async (req, res) => {
    try {
        const {name} = req.body

        const newCourse = new Course({name})

        await newCourse.save()

        res.status(200).json({course: newCourse})
    } catch (e) {
        console.log(e)
    }
}

const getCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate({
                path: 'instructors',
                select: 'fullName'
            })
            .populate({
                path: 'activeGroups',
                select: 'name'
            })
            .populate({
                path: 'activeStudents',
                select: 'fullName'
            })

        res.status(200).json({courses})
    } catch (e) {
        console.log(e)
    }
}

const getCourse = async (req, res) => {
    try {
        const {id} = req.params

        const course = await Course.findById(id)
            .populate({
                path: 'instructors',
                select: 'fullName email role workplace'
            })
            .populate({
                path: 'activeStudents',
                select: 'fullName'
            })

        const activeGroups = await Group.find({
            course: course._id,
            status: 'active'
        }).select('name attendanceTotal status')
        const notActiveGroups = await Group.find({
            course: course._id,
            status: {$ne: 'active'}
        }).select('name attendanceTotal status')

        course.activeGroups = [...activeGroups, ...notActiveGroups]

        res.status(200).json({course})
    } catch (e) {
        console.log(e)
    }
}

const updateCourse = async (req, res) => {
    try {
        const {id} = req.params
        const {name, labels, access, details} = req.body

        const course = await Course.findById(id)
            .populate({
                path: 'instructors',
                select: 'fullName'
            })
            .populate({
                path: 'activeGroups',
                select: 'name'
            })
            .populate({
                path: 'activeStudents',
                select: 'fullName'
            })

        const courseObj = {
            ...course.toObject(),
            name,
            labels,
            access: access === 'true',
            image: req.mediaPath || course.image,
            details
        }

        await Course.findByIdAndUpdate(id, courseObj, {$new: true})

        res.status(200).json({course: courseObj})
    } catch (e) {
        console.log(e)
    }
}

module.exports = {getCourseNames, createCourse, getCourses, getCourse, updateCourse}