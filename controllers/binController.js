import mongoose from 'mongoose'
import Bin from '../models/binModels.js'
import ErrorResponse from '../utils/errorResponse.js'

// @desc    Create Bin
// @route   POST /api/v1/bin/
// @access  Public
export const createBinNote = async (req, res) => {
  const bin = await Bin.create(req.body)

  res.status(201).json({ bin })
}

// @desc    Get All Notes
// @route   GET /api/v1/bin/
// @access  Public
export const getAllBinNotes = async (req, res) => {
  const { search } = req.query

  const query = {}

  if (search) query.title = { $regex: search, $options: 'i' }

  let result = Bin.find(query).sort('-pinned -createdAt')

  // setup pagination
  const page = +req.query.page || 1
  const limit = +req.query.limit || 6
  const skip = (page - 1) * limit

  result = result.skip(skip).limit(limit)

  const binNotes = await result
  const totalNotes = await Bin.countDocuments(query)
  const numOfPages = Math.ceil(totalNotes / limit)
  res.status(200).json({
    totalNotes,
    numOfPages,
    binNotes,
  })
}

// @desc    Update Bin
// @route   PATCH /api/v1/binNotes/:id
export const updateBinNote = async (req, res) => {
  const { id } = req.params
  const { title, body, pinned } = req.body

  const note = await Bin.findByIdAndUpdate(id, { title, body, pinned })
  if (note) {
    res.status(200).json({ note })
  } else {
    throw new ErrorResponse(`No note with id ${id}`, 404)
  }
}

// @desc    Delete Bin
// @route   DELETE /api/v1/binNotes/:id
export const deleteBinNote = async (req, res) => {
  const { id } = req.params
  const note = await Bin.findByIdAndDelete({ _id: id })
  res.status(200).json({ msg: 'Success! Bin removed' })
  if (!note) throw new ErrorResponse(`No note with id ${id}`, 404)
}
