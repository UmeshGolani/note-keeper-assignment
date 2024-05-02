import express from 'express'
const router = express.Router()
import Note from "../models/noteModel.js"
// import controllers
import { createArchieveNote, getAllArchieveNotes, updateArchieveNote, deleteArchieveNote, getArchieveNoteById } from '../controllers/archieveController.js'

router.route('/').get(getAllArchieveNotes).post(createArchieveNote)
router.route('/:id').patch(updateArchieveNote).delete(deleteArchieveNote).get(getArchieveNoteById)



export default router
