const Student = require('../../models/student')
const FormRequest = require('../../models/formRequest')
const Town = require('../../models/town')

const createStudentFromRequest = async (id) => {
    try {
        const formRequest = await FormRequest.findById(id)

        const {firstName, lastName, middleName, town: townName, birthday, gender, birthCertificate, phoneNumbers, parentsFullNames} = formRequest.data

        const town = await Town.findOne({name: townName})

        const birthdayDate = new Date(birthday)

        const newStudent = new Student({
            firstName,
            lastName,
            middleName,
            fullName: `${firstName} ${middleName} ${lastName}`,
            email: '',
            password: '',
            phoneNumbers,
            birthday: {
                year: birthdayDate.getFullYear(),
                month: birthdayDate.getMonth(),
                day: birthdayDate.getDate()
            },
            town: town.id,
            parentsFullNames,
            birthCertificate,
        })

        formRequest.student = newStudent.id

        await newStudent.save()
        await formRequest.save()

        return formRequest
    } catch (e) {
        console.log(e)
    }
}

module.exports = {createStudentFromRequest}