const {OAuth2Client} = require('google-auth-library');
const {login} = require("../services/auth");

const googleClient = new OAuth2Client();

const signIn = async (req, res) => {
    try {
        const { email: credentialLogin, password } = req.body

        const authResult = await login({login: credentialLogin, password})

        res.status(200).json(authResult)
    } catch (e) {
        console.log(e)
    }
}

const googleSignIn = async (req, res) => {
    const token = req.body.token
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID
        });
        const payload = ticket.getPayload()

        const authResult = await login({isGoogleAuth: true, email: payload.email})

        res.status(200).json(authResult)
    } catch (err) {
        console.log(err)
        res.status(400).json({message: "invalid token"})
    }
}

module.exports = { signIn, googleSignIn }