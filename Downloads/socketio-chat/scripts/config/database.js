const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)

    // Create default rooms if they don't exist
    const Room = require("../models/Room")
    const defaultRooms = [
      { name: "general", description: "General discussion", createdBy: "system" },
      { name: "random", description: "Random topics and casual chat", createdBy: "system" },
      { name: "tech", description: "Technology-focused discussions", createdBy: "system" },
    ]

    for (const roomData of defaultRooms) {
      const existingRoom = await Room.findOne({ name: roomData.name })
      if (!existingRoom) {
        await Room.create(roomData)
        console.log(`Created default room: ${roomData.name}`)
      }
    }
  } catch (error) {
    console.error("Database connection error:", error)
    process.exit(1)
  }
}

module.exports = connectDB
