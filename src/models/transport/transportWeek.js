const { Schema, model } = require('mongoose')

const transportWeekSchema = new Schema({
    startDate: { type: Date },
    endDate: { type: Date },
    schedule: { type: Object }
}, { timestamps: true })

module.exports = model('TransportWeek', transportWeekSchema)