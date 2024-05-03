const express = require('express')
const router = express.Router()

const { getAllNotifications, getNewNotificationsCount, markAsRead, deleteNotification} = require('../controllers/notifications')

router.get('/', getAllNotifications)
router.get('/new-count', getNewNotificationsCount)
router.patch('/:id', markAsRead)
router.delete('/:id', deleteNotification)

module.exports = router