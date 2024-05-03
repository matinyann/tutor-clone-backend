const { Schema, model } = require('mongoose')

const transportJourneySchema = new Schema({
    week: { type: Schema.Types.ObjectId },
    day: { type: String },
    hours: { type: String },
    direction: { type: String },
    passengers: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    driver: { type: String, default: null}
}, { timestamps: true })

module.exports = model('TransportJourney', transportJourneySchema)