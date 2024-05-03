const express = require('express')
const router = express.Router()

const { getSettingsOptions } = require('../controllers/settings')

router.get('/', getSettingsOptions)

module.exports = router