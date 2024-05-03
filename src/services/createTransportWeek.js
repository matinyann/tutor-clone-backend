const Group = require('../models/group')
const TransportWeek = require('../models/transport/transportWeek')
const Town = require('../models/town')
const TransportJourney = require('../models/transport/transportJourney')
const days = require('../common/weekdays')

const weekDayHours = [
    '16:00-18:00',
    '18:00-20:00',
]

const weekEndHours = [
    '10:00-12:00',
    '12:00-14:00',
    '14:00-16:00',
    '16:00-18:00',
    '18:00-20:00',
]

const createSchedule = () => {
    const blankWeekSchedule = {}

    days.forEach(day => {
        blankWeekSchedule[day] = {}
    })

    for (const day in blankWeekSchedule) { // Add hours to weekdays
        if (day === 'Saturday' || day === 'Sunday') {
            weekEndHours.forEach(hour => {
                blankWeekSchedule[day][hour] = []
            })
        } else {
            weekDayHours.forEach(hour => {
                blankWeekSchedule[day][hour] = []
            })
        }
    }

    return blankWeekSchedule
}

const createTransportWeekSchedule = async (req, res) => {
    let schedule = createSchedule()
    const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000

    const newTransportWeek = new TransportWeek({
        startDate: new Date().toLocaleString({timeZone: 'GMT+4'}),
        endDate: new Date(new Date().getTime() + oneWeekInMilliseconds).toLocaleString({timeZone: 'GMT+4'}),
        schedule: null
    })

    try {
        const groups = await Group.find({status: 'active'})
            .select('days students')
            .populate({
                path: 'students',
                model: 'Student',
                select: 'town fullName',
                populate: {
                    path: 'town',
                    model: 'Town'
                }
            })

        groups.forEach(async group => {
            const students = group.students
            let studentsTowns = {}

            students.forEach(student => { // At first add towns by students
                studentsTowns = {
                    ...studentsTowns,
                    [student.town.name]: []
                }
            })

            students.forEach(student => {
                studentsTowns = {
                    ...studentsTowns,
                    [student.town.name]: [
                        ...studentsTowns[student.town.name],
                        {
                            id: student._id,
                            name: student.fullName
                        }
                    ]
                }
            })

            for (const day in group.days.class) {
                for (const town in studentsTowns) {
                    // Create journey for every hour in a day
                    const newTransportJourney = new TransportJourney({
                        week: newTransportWeek._id,
                        day,
                        hours: group.days.class[day],
                        passengers: studentsTowns[town].map(student => student.id),
                        direction: town,
                        driver: 'driver'
                    })

                    newTransportJourney.save()

                    if(!schedule[day][group.days.class[day]]) {
                        schedule[day][group.days.class[day]] = []
                    }

                    schedule = {
                        ...schedule,
                        [day]: {
                            ...schedule[day],
                            [group.days.class[day]]: [
                                ...schedule[day][group.days.class[day]],
                                newTransportJourney._id
                            ]
                        }
                    }
                }
            }
        })

        for (const day in schedule) {
            for (const hour in schedule[day]) {
                if (schedule[day][hour].length === 0) {
                    delete schedule[day][hour]
                }
            }
        }

        newTransportWeek.schedule = schedule
        newTransportWeek.save()
    } catch (e) {
        console.log(e)
    }
}

module.exports = createTransportWeekSchedule