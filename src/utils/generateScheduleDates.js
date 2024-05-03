const moment = require('moment')

const getDays = ({ period, weekdays }) => {
    const startDate = moment(period[0]).add(1, 'day')
    const endDate = moment(period[1])
    const dates = []

    while (startDate.isBefore(endDate)) {
        const dayOfWeek = startDate.day()

        if (weekdays.includes(dayOfWeek)) {
            dates.push(startDate.format('DD.MM.YYYY'))
        }
        startDate.add(1, 'day')
    }

    return dates
}

module.exports = getDays