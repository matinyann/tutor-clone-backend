const express = require('express')
const router = express.Router()
const path = require("path");

const authMiddleware = require('../middleware/auth')

const auth = require('./auth')
const groups = require('./groups')
const students = require('./students')
const members = require('./members')
const chats = require('./chats')
const transport = require('./transport')
const towns = require('./towns')
const forms = require('./forms')
const settings = require('./settings')
const courses = require('./courses')
const checkins = require('./checkins')
const materials = require('./learningMaterials')
const notifications = require('./notifications')

router.use('/auth', auth)
router.use('/groups', authMiddleware(), groups)
router.use('/members', authMiddleware(), members)
router.use('/students', authMiddleware(), students)
router.use('/chats', authMiddleware(), chats)
router.use('/transport', authMiddleware(), transport)
router.use('/towns', authMiddleware(), towns)
router.use('/forms', authMiddleware(true), forms)
router.use('/settings', authMiddleware(), settings)
router.use('/courses', authMiddleware(), courses)
router.use('/checkins', checkins)
router.use('/materials', materials)
router.use('/notifications', authMiddleware(), notifications)

router.use('/public', express.static(path.join(__dirname, '../../public')))

module.exports = router