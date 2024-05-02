import mongoose from 'mongoose'
import Note from '../models/noteModel.js'
import ErrorResponse from '../utils/errorResponse.js'

// @desc    Create Note
// @route   POST /api/v1/notes/
// @access  Public
export const createNote = async (req, res) => {
  const note = await Note.create(req.body)
  res.status(201).json({ note })
}

// @desc    Get All Notes
// @route   GET /api/v1/notes/
// @access  Public
export const getAllNotes = async (req, res) => {
  const { search } = req.query

  const query = {}

  if (search) query.title = { $regex: search, $options: 'i' }

  let result = Note.find(query).sort('-pinned -createdAt')

  // setup pagination
  const page = +req.query.page || 1
  const limit = +req.query.limit || 6
  const skip = (page - 1) * limit

  result = result.skip(skip).limit(limit)

  const notes = await result
  const totalNotes = await Note.countDocuments(query)
  const numOfPages = Math.ceil(totalNotes / limit)
  res.status(200).json({
    totalNotes,
    numOfPages,
    notes,
  })
}

export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)

    if (!note) {
      return res.status(404).json({ message: 'Note not found' })
    }

    res.status(200).json({ note })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
}




// @desc    Update Note
// @route   PATCH /api/v1/notes/:id
export const updateNote = async (req, res) => {
  const { id } = req.params
  const { title, text, label,color, body, pinned } = req.body

  const note = await Note.findByIdAndUpdate(id, { title, text, label,color, body, pinned })
  if (note) {
    res.status(200).json({ note })
  } else {
    throw new ErrorResponse(`No note with id ${id}`, 404)
  }
}

// @desc    Delete Note
// @route   DELETE /api/v1/notes/:id
export const deleteNote = async (req, res) => {
  const { id } = req.params
  const note = await Note.findByIdAndDelete({ _id: id })
  res.status(200).json({ msg: 'Success! Note removed' })
  if (!note) throw new ErrorResponse(`No note with id ${id}`, 404)
}
