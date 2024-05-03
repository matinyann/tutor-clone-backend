const Student = require('../models/student')
const Checkin = require('../models/checkin')

const getCheckins = async (req, res) => {
    try {
        const { student, startDate, endDate, page = 1 } = req.query
        const filtersQuery = { student, startDate, endDate }
        const filters = {}

        for (let filter in filtersQuery) {
            if (filtersQuery[filter]) {
                if (filter === 'student') {
                    filters[filter] = await Student.findById(filtersQuery[filter]).select('fullName')
                } else if (filter === 'startDate') {
                    filters['createdAt'] = {$gt: new Date(filtersQuery[filter])}
                } else if (filter === 'endDate') {
                    filters['createdAt'] = {$lt: new Date(filtersQuery[filter])}
                }  else {
                    filters[filter] = filtersQuery[filter]
                }
            }
        }

        const LIMIT = 10
        const startIndex = (Number(page) - 1) * LIMIT

        const total = await Checkin.countDocuments(filters)

        const checkins = await Checkin.find(filters)
            .sort({ createdAt: -1 }).limit(LIMIT).skip(startIndex)
            .populate({
                path: 'student',
                select: 'fullName phoneNumbers'
            })

        res.json({ checkins, pagesCount: Math.ceil(total / LIMIT) })
    } catch (e) {
        console.log(e)
    }
}

module.exports = { getCheckins }