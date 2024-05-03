const TransportWeek = require('../models/transport/transportWeek')
const TransportJourney = require('../models/transport/transportJourney')
const Student = require('../models/student')

const getCurrentSchedule = async (req, res) => {
    const today = new Date()

    try {
        const currentWeek = await TransportWeek.findOne({
            startDate: { $lt: today },
            endDate: { $gte: today }
        })

        let weekObj = currentWeek ? currentWeek.toObject() : null

        if (weekObj) {
            for (const day in weekObj.schedule) {
                for (const hour in weekObj.schedule[day]) {
                    weekObj.schedule[day][hour] = await Promise.all(
                        weekObj.schedule[day][hour].map((id) => TransportJourney.findById(id))
                    )
                }
            }
        }

        res.status(200).json({ currentWeek: weekObj })
    } catch (e) {
        console.log(e);
    }
}

const getJourney = async (req, res) => {
    const { id } = req.params

    try {
        const journey = await TransportJourney.findById(id)
            .populate({
                path: 'passengers',
                select: 'fullName'
            }).exec()

        res.status(200).json({ journey })
    } catch (e) {
        console.log(e);
    }
}

const addHours = async (req, res) => {
    const { id } = req.params
    const { day, hours } = req.body

    try {
        const week = await TransportWeek.findById(id)

        if (week.schedule[day][hours]) {
            return res.status(200).json({ message: 'Hours exist' })
        } else {
            week.schedule[day][hours] = []
        }

        await TransportWeek.findByIdAndUpdate(id, week, { $new: true })

        res.status(200).json({ day, hours })
    } catch (e) {
        console.log(e);
    }
}

const addDirection = async (req, res) => {
    const { id } = req.params
    const { day, hours, direction } = req.body

    try {
        const week = await TransportWeek.findById(id)
        const journey = await TransportJourney.findOne({ week: week._id, day, hours, direction })

        if (journey) return res.status(200).json({ message: `A direction to ${direction} on ${day} at ${hours} already exists.` })

        const newJourney = new TransportJourney({
            week: week._id,
            day,
            hours,
            direction,
            passangers: []
        })

        week.schedule[day][hours].push(newJourney._id)

        newJourney.save()
        await TransportWeek.findByIdAndUpdate(id, week, { $new: true })

        res.status(200).json({ day, hours, journey: newJourney })
    } catch (e) {
        console.log(e);
    }
}

const addPassenger = async (req, res) => {
    try {
        const { id, passenger } = req.params

        const journey = await TransportJourney.findById(id)

        if (journey.passengers.includes(passenger)) {
            return res.status(200).json({ message: 'The passenger already exists in this journey' })
        } else {
            journey.passengers.push(passenger)
        }

        await TransportJourney.findByIdAndUpdate(id, journey, { $new: true })

        const addedPassenger = await Student.findById(passenger).select('fullName')

        res.status(200).json({ passenger: addedPassenger, day: journey.day, hours: journey.hours, journey })
    } catch (e) {
        console.log(e);
    }
}

module.exports = { getCurrentSchedule, getJourney, addHours, addDirection, addPassenger }