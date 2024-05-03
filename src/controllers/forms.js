const Form = require('../models/form')
const FormRequest = require('../models/formRequest')
const {createStudentFromRequest} = require("../services/students/createStudentFromRequests");

const createRequestForm = async (req, res) => {
    try {
        const {name, course, slug, successMessage} = req.body

        const newRequestForm = new Form({
            name, course, slug, image: req.mediaPath, successMessage
        })

        await newRequestForm.save()

        res.status(200).json({requestForm: newRequestForm})
    } catch (e) {
        console.log(e)
    }
}

const getRequestForms = async (req, res) => {
    try {
        const {page} = req.query
        const LIMIT = 10
        const startIndex = (Number(page) - 1) * LIMIT

        const total = await Form.countDocuments()

        const requestForms = await Form.find()
            .select('-body')
            .sort({_id: -1})
            .limit(LIMIT)
            .skip(startIndex)

        res.status(200).json({data: requestForms, pagesCount: Math.ceil(total / LIMIT)})
    } catch (e) {
        console.log(e)
    }
}

const getRequestForm = async (req, res) => {
    try {
        const {id} = req.params

        let requestForm

        if (req.role === 'manager') {
            requestForm = await Form.findOne({_id: id})
        } else {
            requestForm = await Form.findOne({_id: id, accessible: true})
        }

        res.status(200).json({requestForm})
    } catch (e) {
        console.log(e)
    }
}

const editRequestForm = async (req, res) => {
    try {
        const {id} = req.params
        const {data: editedForm} = req.body

        const requestForm = await Form.findById(id)

        await Form.findByIdAndUpdate(id, editedForm, {$new: true})

        res.status(200).json({requestForm})
    } catch (e) {
        console.log(e)
    }
}

const changeRequestFormAccess = async (req, res) => {
    try {
        const {id} = req.params

        const requestForm = await Form.findById(id)

        requestForm.accessible = !requestForm.accessible

        await requestForm.save()

        res.status(200).json({id, changedTo: requestForm.accessible})
    } catch (e) {
        console.log(e)
    }
}

const deleteRequestForm = async (req, res) => {
    try {
        const {id} = req.params

        await Form.findByIdAndDelete(id)

        res.status(200).json({id})
    } catch (e) {
        console.log(e)
    }
}

const searchForms = async (req, res) => {
    try {
        const {search, page} = req.query

        const searchTerm = new RegExp(search, 'i')

        const LIMIT = 10
        const startIndex = (Number(page) - 1) * LIMIT

        const total = await Form.countDocuments({name: searchTerm})

        const searchedForms = await Form.find({name: searchTerm})
            .select('-body')
            .sort({_id: -1})
            .limit(LIMIT)
            .skip(startIndex)

        res.status(200).json({data: searchedForms, pagesCount: Math.ceil(total / LIMIT)})
    } catch (e) {
        console.log(e)
    }
}

const submitForm = async (req, res) => {
    try {
        const {formId, data} = req.body

        const newFormRequest = new FormRequest({formId, data})

        await newFormRequest.save()

        res.status(200).json({message: 'Submitted'})
    } catch (e) {
        console.log(e)
    }
}

const getRequestsOfForm = async (req, res) => {
    try {
        const filtersQuery = req.query

        const pageSize = Number(filtersQuery.size)
        const page = Number(filtersQuery.page)

        const filters = {}

        for (const filter in filtersQuery) {
            if (filtersQuery[filter]) {
                if (filter === 'firstName' || filter === 'lastName' || filter === 'middleName' || filter === 'town') {
                    filters[`data.${filter}`] = new RegExp(filtersQuery[filter], 'i')
                } else if (filter === 'student') {
                    // TODO student/not student
                } else if (filter === 'page' || filter === 'size') {

                } else {
                    filters[filter] = filtersQuery[filter]
                }
            }
        }

        const startIndex = (page - 1) * pageSize

        const total = await FormRequest.countDocuments(filters)

        const requests = await FormRequest.find(filters)
            .sort({_id: -1})
            .limit(pageSize)
            .skip(startIndex)

        res.status(200).json({data: requests, pagesCount: Math.ceil(total / pageSize)})
    } catch (e) {
        console.log(e)
    }
}

const editFormRequest = async (req, res) => {
    try {
        const {id} = req.params
        const {data} = req.body

        await FormRequest.findByIdAndUpdate(id, data, {$new: true})

        res.status(200).json({id, newFormRequest: data, message: 'Request has been edited successfully.'})
    } catch (e) {
        console.log(e);
    }
}

const deleteFormRequest = async (req, res) => {
    try {
        const {id} = req.params

        await FormRequest.findByIdAndDelete(id)

        res.status(200).json({id, message: 'Request has been deleted successfully.'})
    } catch (e) {
        console.log(e);
    }
}

const createStudent = async (req, res) => {
    try {
        const {id} = req.params

        // Create student and return the changed form request that contains created student's ID
        const editedFormRequest = await createStudentFromRequest(id)

        res.status(200).json({id, formRequest: editedFormRequest})
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    createRequestForm,
    getRequestForm,
    editRequestForm,
    getRequestForms,
    changeRequestFormAccess,
    deleteRequestForm,
    submitForm,
    getRequestsOfForm,
    deleteFormRequest,
    editFormRequest,
    createStudent,
    searchForms,
}