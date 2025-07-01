const User = require("../models/User")

class UserController {
  // Create or update user
  static async createOrUpdateUser(userData) {
    try {
      const existingUser = await User.findOne({ username: userData.username })

      if (existingUser) {
        // Update existing user
        existingUser.socketId = userData.socketId
        existingUser.online = true
        existingUser.lastSeen = new Date()
        await existingUser.save()
        return existingUser
      } else {
        // Create new user
        const newUser = new User({
          username: userData.username,
          socketId: userData.socketId,
          online: true,
        })
        await newUser.save()
        return newUser
      }
    } catch (error) {
      console.error("Error creating/updating user:", error)
      throw error
    }
  }

  // Get all online users
  static async getOnlineUsers() {
    try {
      const users = await User.find({ online: true }).select("username socketId online lastSeen").lean()
      return users
    } catch (error) {
      console.error("Error fetching online users:", error)
      throw error
    }
  }

  // Set user offline
  static async setUserOffline(socketId) {
    try {
      const user = await User.findOne({ socketId })
      if (user) {
        user.online = false
        user.lastSeen = new Date()
        await user.save()
        return user
      }
      return null
    } catch (error) {
      console.error("Error setting user offline:", error)
      throw error
    }
  }

  // Get user by socket ID
  static async getUserBySocketId(socketId) {
    try {
      const user = await User.findOne({ socketId }).lean()
      return user
    } catch (error) {
      console.error("Error fetching user by socket ID:", error)
      throw error
    }
  }

  // Get user statistics
  static async getUserStats(username) {
    try {
      const Message = require("../models/Message")

      const user = await User.findOne({ username }).lean()
      if (!user) return null

      const messageCount = await Message.countDocuments({ username })

      return {
        ...user,
        messageCount,
        memberSince: user.joinedAt,
      }
    } catch (error) {
      console.error("Error fetching user stats:", error)
      throw error
    }
  }
}

module.exports = UserController
