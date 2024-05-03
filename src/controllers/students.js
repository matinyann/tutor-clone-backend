const Student = require('../models/student')
const Town = require('../models/town')

const createStudent = async (req, res) => {
    try {
        const {firstName, middleName, lastName, birthday, town, phoneNumbers, parentsFullNames} = req.body

        const selectedTown = Town.find({name: town})

        const parsedBitrhday = birthday.split('.')

        const newStudent = new Student({
            firstName,
            middleName,
            lastName,
            email: '',
            password: '',
            role: 'student',
            phoneNumbers,
            status: '',
            avatar: 'http://localhost:5000/api/public/avatars/male.png',
            parentsFullNames,
            town: selectedTown.name,
            birthday: {
                year: parsedBitrhday[0],
                month: parsedBitrhday[1],
                day: parsedBitrhday[2],
            }
        })

        await newStudent.save()

        res.status(200).json({message: 'Student creation form submitted.'})
    } catch (e) {
        console.log(e)
    }
}

const getStudent = async (req, res) => {
    try {
        const {id} = req.params

        const student = await Student.findById(id).populate('town').exec()

        res.status(200).json({student})
    } catch (e) {
        console.log(e);
    }
}

const getStudentName = async (req, res) => {
    try {
        const {id} = req.params

        const student = await User.findById(id).select('firstName middleName lastName avatar email')

        res.status(200).json({student})
    } catch (e) {
        console.log(e);
    }
}

const getStudentNameSuggestions = async (req, res) => {
    try {
        const {value} = req.body

        const studentNameSuggestions = await Student.find({
            fullName: new RegExp(value, 'i')
        }).limit(5).select('avatar fullName')

        res.status(200).json({suggestions: studentNameSuggestions})
    } catch (e) {
        console.log(e);
    }
}

const updateStudent = async (req, res) => {
    try {
        const {id} = req.params
        const data = req.body

        data.fullName = `${data.firstName} ${data.middleName} ${data.lastName}`

        await Student.findByIdAndUpdate(id, data, {$new: true})

        const student = await Student.findById(id).populate('town')

        res.status(200).json({student})
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    createStudent,
    getStudent,
    getStudentName,
    getStudentNameSuggestions,
    updateStudent
}