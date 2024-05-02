import mongoose from 'mongoose'
import Archieve from '../models/archieveModels.js'
import ErrorResponse from '../utils/errorResponse.js'

// @desc    Create Archieve
// @route   POST /api/v1/bin/
// @access  Public
export const createArchieveNote = async (req, res) => {
  const archieveNote = await Archieve.create(req.body)

  res.status(201).json({ archieveNote })
}

// @desc    Get All Notes
// @route   GET /api/v1/binNotes/
// @access  Public
export const getAllArchieveNotes = async (req, res) => {
  const { search } = req.query

  const query = {}

  if (search) query.title = { $regex: search, $options: 'i' }

  let result = Archieve.find(query).sort('-pinned -createdAt')

  // setup pagination
  const page = +req.query.page || 1
  const limit = +req.query.limit || 6
  const skip = (page - 1) * limit

  result = result.skip(skip).limit(limit)

  const archieveNotes = await result
  const totalNotes = await Archieve.countDocuments(query)
  const numOfPages = Math.ceil(totalNotes / limit)
  res.status(200).json({
    totalNotes,
    numOfPages,
    archieveNotes,
  })
}

export const getArchieveNoteById = async (req, res) => {
  try {
    const archieveNote = await Archieve.findById(req.params.id)

    if (!archieveNote) {
      return res.status(404).json({ message: 'Note not found' })
    }

    res.status(200).json({ archieveNote })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
}

// @desc    Update Archieve
// @route   PATCH /api/v1/binNotes/:id
export const updateArchieveNote = async (req, res) => {
  const { id } = req.params
  const { title, body, pinned } = req.body

  const note = await Archieve.findByIdAndUpdate(id, { title, body, pinned })
  if (note) {
    res.status(200).json({ note })
  } else {
    throw new ErrorResponse(`No note with id ${id}`, 404)
  }
}

// @desc    Delete Archieve
// @route   DELETE /api/v1/binNotes/:id
export const deleteArchieveNote = async (req, res) => {
  const { id } = req.params
  const note = await Archieve.findByIdAndDelete({ _id: id })
  res.status(200).json({ msg: 'Success! Archieve removed' })
  if (!note) throw new ErrorResponse(`No note with id ${id}`, 404)
}
