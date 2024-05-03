const express = require('express')
const router = express.Router()

const { signIn, googleSignIn} = require('../controllers/auth')

router.post('/sign-in', signIn)
router.post('/google', googleSignIn)

module.exports = router