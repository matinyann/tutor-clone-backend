const express = require('express')
const router = express.Router()

const { getTownSuggestions } = require('../controllers/towns')

router.post('/suggest', getTownSuggestions)

module.exports = router