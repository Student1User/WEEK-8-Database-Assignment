const mongoose = require("mongoose")

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    type: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    participants: [
      {
        username: String,
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdBy: {
      type: String,
      required: true,
    },
    messageCount: {
      type: Number,
      default: 0,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

roomSchema.index({ name: 1 })
roomSchema.index({ type: 1 })

module.exports = mongoose.model("Room", roomSchema)
