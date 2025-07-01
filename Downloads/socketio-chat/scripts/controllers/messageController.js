const Message = require("../models/Message")
const Room = require("../models/Room")

class MessageController {
  // Save a new message to database
  static async saveMessage(messageData) {
    try {
      const message = new Message({
        username: messageData.username,
        content: messageData.content,
        room: messageData.room,
        messageType: messageData.messageType || "text",
      })

      const savedMessage = await message.save()

      // Update room's last activity and message count
      await Room.findOneAndUpdate(
        { name: messageData.room },
        {
          lastActivity: new Date(),
          $inc: { messageCount: 1 },
        },
      )

      return savedMessage
    } catch (error) {
      console.error("Error saving message:", error)
      throw error
    }
  }

  // Get messages for a room with pagination
  static async getMessages(room, page = 1, limit = 50) {
    try {
      const skip = (page - 1) * limit

      const messages = await Message.find({ room }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()

      return messages.reverse() // Return in chronological order
    } catch (error) {
      console.error("Error fetching messages:", error)
      throw error
    }
  }

  // Add reaction to a message
  static async addReaction(messageId, emoji, username) {
    try {
      const message = await Message.findById(messageId)
      if (!message) return null

      const existingReaction = message.reactions.find((r) => r.emoji === emoji)

      if (existingReaction) {
        const userIndex = existingReaction.users.indexOf(username)
        if (userIndex > -1) {
          // Remove reaction
          existingReaction.users.splice(userIndex, 1)
          if (existingReaction.users.length === 0) {
            message.reactions = message.reactions.filter((r) => r.emoji !== emoji)
          }
        } else {
          // Add reaction
          existingReaction.users.push(username)
        }
      } else {
        // Create new reaction
        message.reactions.push({ emoji, users: [username] })
      }

      await message.save()
      return message
    } catch (error) {
      console.error("Error adding reaction:", error)
      throw error
    }
  }

  // Mark message as read
  static async markAsRead(messageId, username) {
    try {
      const message = await Message.findById(messageId)
      if (!message) return null

      const alreadyRead = message.readBy.find((r) => r.username === username)
      if (!alreadyRead) {
        message.readBy.push({ username, readAt: new Date() })
        await message.save()
      }

      return message
    } catch (error) {
      console.error("Error marking message as read:", error)
      throw error
    }
  }

  // Search messages
  static async searchMessages(query, room = null, limit = 20) {
    try {
      const searchFilter = {
        content: { $regex: query, $options: "i" },
      }

      if (room) {
        searchFilter.room = room
      }

      const messages = await Message.find(searchFilter).sort({ createdAt: -1 }).limit(limit).lean()

      return messages
    } catch (error) {
      console.error("Error searching messages:", error)
      throw error
    }
  }
}

module.exports = MessageController
