import express from 'express'
const router = express.Router()
import Note from "../models/noteModel.js"
// import controllers
import { createBinNote, getAllBinNotes, updateBinNote, deleteBinNote } from '../controllers/binController.js'

router.route('/').get(getAllBinNotes).post(createBinNote)
router.route('/:id').patch(updateBinNote).delete(deleteBinNote)



export default router
