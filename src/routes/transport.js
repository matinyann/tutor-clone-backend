const express = require('express')
const router = express.Router()

const { getCurrentSchedule, getJourney, addHours, addDirection, addPassenger } = require('../controllers/transport')

router.get('/current', getCurrentSchedule)
router.get('/journey/:id', getJourney)

router.post('/add-hours/:id', addHours)
router.post('/add-direction/:id', addDirection)
router.post('/add-passenger/:id/:passenger', addPassenger)

module.exports = router