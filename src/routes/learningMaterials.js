const express = require('express')
const router = express.Router()

const { getMaterials, createMaterial} = require('../controllers/learningMaterials')
const upload = require("../middleware/upload")

router.post('/', upload('materials').single('image'), createMaterial)
router.get('/', getMaterials)

module.exports = router