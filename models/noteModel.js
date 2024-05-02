import mongoose from 'mongoose'

const NoteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            unique: true,
            maxlength: 100,
            required: true,
        },
        text: {
            type: String,
            maxlength: 500,
        },
        label: {
            type: String,
            maxlength: 20,
        },
        color: {
            type: String,
            maxlength: 15,
        },
        body: String,
        pinned: {
            type: Boolean,
            default: false,
        },
    },
    {timestamps: true}
)

const Note = mongoose.model('Note', NoteSchema)

export default Note
