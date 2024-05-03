const Group = require('../models/group')
const Checkin = require('../models/checkin')

const createCheckins = async () => {
    try {
        const newCheckin = new Checkin({
            student: '64386549edbf4c3298e6ca86',
        })

        newCheckin.save()
    } catch (e) {
        console.log(e)
    }
}

module.exports = createCheckins