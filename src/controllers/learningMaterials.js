const LearningMaterial = require('../models/learningMaterials')
const Course = require("../models/course")


const createMaterial = async (req, res) => {
    try {
        const {name, type, autogenerate} = req.body

        const newMaterial = new LearningMaterial({
            name,
            type,
            autogenerate: autogenerate === 'true',
            image: req.mediaPath
        })

        await newMaterial.save()

        res.status(200).json({ material: newMaterial })
    } catch (e) {
        console.log(e)
    }
}
const getMaterials = async (req, res) => {
    try {
        const filtersQuery = req.query
        const filters = {}

        for (let filter in filtersQuery) {
            if (filtersQuery[filter]) {
                if (filter === 'name') {
                    filters[filter] = await RegExp(filtersQuery[filter], 'i')
                } else if (filter === 'course') {
                    filters[filter] = await Course.findById(filtersQuery[filter])
                } else {
                    filters[filter] = filtersQuery[filter]
                }
            }
        }

        const materials = await LearningMaterial.find(filters)
            .populate({
                path: 'course',
                select: 'name'
            })

        res.status(200).json({ materials })
    } catch (e) {
        console.log(e)
    }
}

module.exports = {createMaterial, getMaterials}