const express = require('express')
const router = express.Router()

const {
    getChats, createChat, getChatsOfGroup, getChat, getNewMessagesCount, markAsSeen,
    getSeenByMembersList
} = require('../controllers/chats')

router.get('/', getChats)
router.get('/group/:id', getChatsOfGroup)
router.post('/', createChat)
router.get('/new-count', getNewMessagesCount)
router.get('/:id', getChat)
router.patch('/mark-seen/:chatId', markAsSeen)
router.get('/seenby/:id', getSeenByMembersList)

module.exports = router