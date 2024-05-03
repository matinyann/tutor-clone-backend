const express = require('express')
const router = express.Router()
const upload = require('../middleware/upload')

const {
    createRequestForm, getRequestForm, editRequestForm, getRequestForms, changeRequestFormAccess, submitForm,
    getRequestsOfForm, editFormRequest, deleteFormRequest, createStudent, deleteRequestForm, searchForms
} = require('../controllers/forms')

router.get('/requests', getRequestsOfForm)

router.post('/', upload('forms').single('image'), createRequestForm)

router.get('/', getRequestForms)
router.get('/search', searchForms)
router.get('/:id', getRequestForm)
router.patch('/:id', editRequestForm)
router.patch('/access/:id', changeRequestFormAccess)
router.delete('/:id', deleteRequestForm)

router.post('/submit', submitForm)
router.patch('/requests/:id', editFormRequest)
router.delete('/requests/:id', deleteFormRequest)

router.post('/requests/:id/create-student', createStudent)

module.exports = router
