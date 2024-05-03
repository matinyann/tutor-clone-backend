const Member = require("../../models/member");
const bc = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET

const login = async ({login, password, isGoogleAuth, email}) => {
    try {
        if(isGoogleAuth && email) {
            const member = await Member.findOne({email})

            if (!member) return { message: 'Invalid credentials', status: 400}

            const token = jwt.sign({ id: member._id, role: member.role }, jwtSecret)

            const memberObj = member.toObject()
            delete memberObj.password

            return { user: memberObj, token }
        } else {
            const member = await Member.findOne({$or: [{ email: login }, {username: login}]})

            if (!member) return { message: 'Invalid credentials' }

            const correctPassword = await bc.compare(password, member.password)

            if (!correctPassword) return { message: 'Invalid credentials' }

            const token = jwt.sign({ id: member._id, role: member.role }, jwtSecret)

            const memberObj = member.toObject()
            delete memberObj.password

            return { user: memberObj, token }
        }
    } catch (e) {
        console.log(e);
    }
}

module.exports = {login}