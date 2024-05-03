const Notification = require('../models/notification')

const getAllNotifications = async (req, res) => {
    try {
        const { page = 1 } = req.query

        const LIMIT = 5
        const startIndex = (Number(page) - 1) * LIMIT

        const total = await Notification.countDocuments({userId: req.userId})
        const notifications = await Notification.find({userId: req.userId})
            .sort({isRead: 1, createdAt: -1})
            .limit(LIMIT)
            .skip(startIndex)

        res.status(200).json({ notifications, numberOfPages: Math.ceil(total / LIMIT) })
    } catch (e) {
        console.log(e)
    }
}

const getNewNotificationsCount = async (req, res) => {
    try {
        const count = await Notification.find({userId: req.userId, isRead: false}).count()

        res.status(200).json({count})
    } catch (e) {
        console.log(e)
    }
}

const markAsRead = async (req, res) => {
    try {
        const {id} = req.params
        const notification = await Notification.findById(id)

        notification.isRead = true

        await notification.save()

        res.status(200).json({id})
    } catch (e) {
        console.log(e)
    }
}

const deleteNotification = async (req, res) => {
    try {
        const {id} = req.params
        await Notification.findByIdAndDelete(id)

        res.status(200).json({id})
    } catch (e) {
        console.log(e)
    }
}

module.exports = {getAllNotifications, getNewNotificationsCount, markAsRead, deleteNotification}