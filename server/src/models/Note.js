const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    // Topic/title given by the user
    topic: {
      type: String,
      required: true,
      trim: true,
    },

    // Subject to which this note belongs
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    // Original PDF filename
    fileName: {
      type: String,
      required: true,
      trim: true,
    },

    // Location/path of uploaded PDF
    fileUrl: {
      type: String,
      required: true,
    },

    // File information
    fileSize: {
      type: Number,
      required: true,
    },

    fileType: {
      type: String,
      required: true,
    },

    // Owner of the note
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Note", noteSchema);