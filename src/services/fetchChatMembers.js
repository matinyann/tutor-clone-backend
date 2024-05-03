const Member = require("../models/member")
const Student = require("../models/student")

const fetchChatMembers = async (members) => {
    const fetchedMembers = await Promise.all([
        ...members.map(async (id) => await Member.findById(id).select('fullName role avatar')),
        ...members.map(async (id) => await Student.findById(id).select('fullName role avatar'))
    ])

    return fetchedMembers.filter(e => e)
}

module.exports = fetchChatMembers