const fetchSettingsOptions = require('../services/fetchSettingsOptions')

const getSettingsOptions = async (req, res) => {
    try {
        const options = fetchSettingsOptions(req.role)

        res.status(200).json({options})
    } catch (e) {
        console.log(e);
    }
}

module.exports = { getSettingsOptions }