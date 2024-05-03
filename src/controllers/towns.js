const Town = require('../models/town')

const getTownSuggestions = async (req, res) => {
    try {
        const { value } = req.body

        const suggestedTowns = await Town.find({ name: new RegExp(value, 'i') }).limit(5)

        res.status(200).json({ suggestedTowns })
    } catch (e) {
        console.log(e);
    }
}

module.exports = { getTownSuggestions }