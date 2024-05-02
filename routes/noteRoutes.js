import express from 'express'
const router = express.Router()
import Note from "../models/noteModel.js"
// import controllers
import { createNote, getAllNotes, updateNote, deleteNote, getNoteById } from '../controllers/notesController.js'

router.route('/').get(getAllNotes).post(createNote)
router.route('/:id').patch(updateNote).delete(deleteNote)
router.route('/:id').get(getNoteById)


export default router
