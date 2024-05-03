const Members = require('../models/member')
const bc = require("bcrypt");
const Member = require("../models/member");
const Course = require("../models/course");
const createNewMember = async (req, res) => {
    try {
        const {role, fullName, email, password, workplace, phoneNumber} = req.body

        const user = await Members.findOne({ email })

        if (user) return res.status(400).json({ message: 'Members already exists' })

        const hashedPassword = await bc.hash(password, 10)

        const newMember = new Members({
            role,
            fullName,
            email,
            password: hashedPassword,
            workplace,
            phoneNumbers: [phoneNumber]
        })

        await newMember.save()

        res.status(200).json({member: newMember})
    } catch (e) {
        console.log(e)
    }
}

const getMembers = async (req, res) => {
    try {
        const filtersQuery = req.query
        const filters = {}

        for (const filter in filtersQuery) {
            if (filtersQuery[filter]) {
                if (filter === 'name') {
                    filters['email'] = new RegExp(filtersQuery[filter], 'i')
                } else {
                    filters[filter] = filtersQuery[filter]
                }
            }
        }

        const members = await Members.find(filters)

        res.status(200).json({members})
    } catch (e) {
        console.log(e)
    }
}

const getMember = async (req, res) => {
    try {
        const {id} = req.params
        const member = await Members.findById(id)

        res.status(200).json({member})
    } catch (e) {
        console.log(e)
    }
}

const getInstructors = async (req, res) => {
    try {
        const members = await Members.find({role: 'instructor'}).select('fullName avatar')

        res.status(200).json({members})
    } catch (e) {
        console.log(e);
    }
}

const getInstructorNames = async (req, res) => {
    try {
        const instructors = await Members.find({role: 'instructor'}).select('fullName')

        res.status(200).json({instructors})
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    createNewMember,
    getMembers,
    getMember,
    getInstructors,
    getInstructorNames
}