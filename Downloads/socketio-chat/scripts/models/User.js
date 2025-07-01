const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
    },
    socketId: {
      type: String,
      required: true,
    },
    online: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },
    avatar: {
      type: String,
      trim: true,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    messageCount: {
      type: Number,
      default: 0,
    },
    preferences: {
      soundEnabled: {
        type: Boolean,
        default: true,
      },
      notificationsEnabled: {
        type: Boolean,
        default: true,
      },
      darkMode: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  },
)

// Index for faster queries
userSchema.index({ username: 1 })
userSchema.index({ online: 1 })
userSchema.index({ socketId: 1 })

module.exports = mongoose.model("User", userSchema)
