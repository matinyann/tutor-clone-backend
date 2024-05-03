const jwt = require("jsonwebtoken")
require('dotenv').config()
const secret = process.env.JWT_SECRET

const Member = require('../models/member')
const Student = require('../models/student')

const getUserModel = async (userId) => {
    try {
        let model

        if (await Member.findById(userId)) {
            model = 'Member'
            return model
        } else if (await Student.findById(userId)) {
            model = 'Student'
            return model
        }

    } catch (e) {
        console.log(e)
    }
}

const auth = (continueWithoutAuth) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];

            let decodedData
            if (token) {
                decodedData = jwt.verify(token, secret)
            } else {
                if (continueWithoutAuth) {
                    next()
                } else {
                    return res.status(401).json({message: 'not authorized'})
                }
            }

            req.userId = decodedData?.id
            req.role = decodedData?.role
            req.userModel = await getUserModel(decodedData?.id)

            next()
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = auth;