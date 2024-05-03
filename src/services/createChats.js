const Group = require('../models/group')
const Chat = require('../models/chat')
const Members = require('../models/member')

const createChats = async (req, res) => {
    try {
        const groups = await Group.find()
        const managers = await Members.find({role: 'manager'}).select('fullName')

        groups.forEach(group => {
            const newChat = new Chat({
                name: group.name,
                image: group.image,
                type: 'group',
                group: group._id,
                members: group.students
            })

            managers.forEach(manager => newChat.members.push(manager._id.toString()))
            newChat.members.push(group.instructor)
            group.chat = newChat._id

            newChat.save()
            group.save()
        })
    } catch (e) {
        console.log(e)
    }
}

module.exports = {createChats}