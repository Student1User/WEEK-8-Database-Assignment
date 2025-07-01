const mongoose = require("mongoose")

const reactionSchema = new mongoose.Schema({
  emoji: {
    type: String,
    required: true,
  },
  users: [
    {
      type: String,
      required: true,
    },
  ],
})

const messageSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    room: {
      type: String,
      required: true,
      trim: true,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file", "system"],
      default: "text",
    },
    fileUrl: {
      type: String,
      trim: true,
    },
    fileName: {
      type: String,
      trim: true,
    },
    fileSize: {
      type: Number,
    },
    reactions: [reactionSchema],
    readBy: [
      {
        username: String,
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    edited: {
      type: Boolean,
      default: false,
    },
    editedAt: Date,
    status: {
      type: String,
      enum: ["sending", "sent", "delivered", "read"],
      default: "sent",
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
messageSchema.index({ room: 1, createdAt: -1 })
messageSchema.index({ username: 1 })
messageSchema.index({ createdAt: -1 })
messageSchema.index({ content: "text" }) // Text search index

module.exports = mongoose.model("Message", messageSchema)
