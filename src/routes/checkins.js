const express = require('express')
const router = express.Router()

const { getCheckins } = require('../controllers/checkins')

router.get('/', getCheckins)

module.exports = router