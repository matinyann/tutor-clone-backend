const multer = require("multer")
require('dotenv').config()

const SITE_URL = process.env.SITE_URL

const imageUpload = (type = '') => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            if(typeof file !== 'string') {
                cb(null, `public`)
            }
        },
        filename: (req, file, cb) => {
            if(typeof file === 'string') {
                req.mediaPath = file
            } else {
                const mediaPath = `${type && type + '/'}${Date.now()}-${file.originalname}`
                req.mediaPath = `${SITE_URL}/public/${mediaPath}`
                cb(null, mediaPath)
            }
        }
    })

    return multer({storage})
}

module.exports = imageUpload