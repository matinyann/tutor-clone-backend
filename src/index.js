const mongoose = require('mongoose')
const {server} = require("./socket");
require('dotenv').config()

const generateGroupsAttendances = require("./services/generateGroupsAttendances");
const {createChats} = require("./services/createChats");
const {createCourses} = require("./services/createCourses");
const fetchActiveGroupsForCourses = require("./services/fetchActiveGroupsForCourses");
const createCheckins = require("./services/createCheckins");
const createTransportWeek = require("./services/createTransportWeek");
const {createNotification} = require("./services/notifications");

const {createStudents} = require('./createStudents')

// const {connectRedis} = require('./redis')

const PORT = process.env.PORT

const start = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/tutor-clone', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        await generateGroupsAttendances()
        await createChats()

        server.listen(PORT, () => {
            console.log(`server started on port ${PORT}`);
        })

        // await connectRedis()
    } catch (e) {
        console.log(e)
    }
}

start()