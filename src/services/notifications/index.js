const Notification = require('../../models/notification')

const createNotification = async (io, userId, title, message, metadata) => {
    try {
        const newNotification = new Notification({
            userId,
            title,
            message,
            metadata
        })

        io.to(`user-${userId}`).emit('receive_new_notification', newNotification)

        await newNotification.save()

        return newNotification
    } catch (e) {
        console.log(e)
    }
}

const getNotificationsOfUser = async (userId) => {
    try {
        const notifications = await Notification.find({userId, isRead: false})

        return notifications
    } catch (e) {
        console.log(e)
    }
}

const markAsReadNotification = async (id) => {
    try {
        const notification = await Notification.findById(id)

        notification.isRead = true

        await notification.save()

        return notification
    } catch (e) {
        console.log(e)
    }
}

const deleteNotification = async (id) => {
    try {
        await Notification.findByIdAndDelete(id)
    } catch (e) {
        console.log(e)
    }
}

module.exports = {createNotification, getNotificationsOfUser, markAsReadNotification, deleteNotification}