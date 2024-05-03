import express from 'express'
const router = express.Router()
import Note from "../models/noteModel.js"
// import controllers
import { createBinNote, getAllBinNotes, updateBinNote, deleteBinNote, getBinNoteById } from '../controllers/binController.js'

router.route('/').get(getAllBinNotes).post(createBinNote)
router.route('/:id').patch(updateBinNote).delete(deleteBinNote).get(getBinNoteById)



export default router
