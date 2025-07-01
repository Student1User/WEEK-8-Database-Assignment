// Real-time Chat Server with Socket.io and MongoDB
require("dotenv").config()

const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const cors = require("cors")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const connectDB = require("./config/database")

// Import controllers
const MessageController = require("./controllers/messageController")
const UserController = require("./controllers/userController")
const FileController = require("./controllers/fileController")

const app = express()
const server = http.createServer(app)

// Connect to MongoDB
connectDB()

// Configure CORS for Socket.io
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
})

app.use(cors())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  })
})

// File upload endpoint
app.post("/upload", multer({ dest: uploadsDir }).single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    const fileUrl = `/uploads/${req.file.filename}`
    res.json({ fileUrl, fileName: req.file.originalname, fileSize: req.file.size })
  } catch (error) {
    console.error("File upload error:", error)
    res.status(500).json({ error: "File upload failed" })
  }
})

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  // Handle user joining
  socket.on("join", async ({ username, room, status }) => {
    try {
      // Create or update user in database
      const user = await UserController.createOrUpdateUser({
        username,
        socketId: socket.id,
        status: status || "",
      })

      socket.join(room)
      socket.username = username
      socket.currentRoom = room

      // Get recent messages for the room
      const recentMessages = await MessageController.getMessages(room, 1, 50)
      socket.emit("messageHistory", recentMessages)

      // Notify others about new user
      socket.broadcast.emit("userJoined", {
        id: socket.id,
        username,
        online: true,
        status: status || "",
      })

      // Send current users list to all clients
      const onlineUsers = await UserController.getOnlineUsers()
      io.emit("usersUpdate", onlineUsers)

      console.log(`${username} joined room: ${room}`)
    } catch (error) {
      console.error("Error handling user join:", error)
      socket.emit("error", { message: "Failed to join chat" })
    }
  })

  // Handle joining a room
  socket.on("joinRoom", async ({ username, room }) => {
    try {
      socket.join(room)
      socket.currentRoom = room

      // Get recent messages for the new room
      const recentMessages = await MessageController.getMessages(room, 1, 50)
      socket.emit("messageHistory", recentMessages)

      socket.broadcast.to(room).emit("userJoined", { username, room })
      console.log(`${username} joined room: ${room}`)
    } catch (error) {
      console.error("Error joining room:", error)
    }
  })

  // Handle leaving a room
  socket.on("leaveRoom", ({ username, room }) => {
    socket.leave(room)
    socket.broadcast.to(room).emit("userLeft", { username, room })
    console.log(`${username} left room: ${room}`)
  })

  // Handle messages
  socket.on("message", async (messageData) => {
    try {
      // Save message to database
      const savedMessage = await MessageController.saveMessage(messageData)

      // Convert MongoDB document to plain object and add id field
      const messageToSend = {
        id: savedMessage._id.toString(),
        username: savedMessage.username,
        content: savedMessage.content,
        room: savedMessage.room,
        type: savedMessage.messageType || "text",
        timestamp: savedMessage.createdAt,
        reactions: savedMessage.reactions || [],
        readBy: savedMessage.readBy || [],
        status: "sent",
      }

      // Send message to all users in the room
      io.to(messageData.room).emit("message", messageToSend)

      console.log(`Message from ${messageData.username} in ${messageData.room}: ${messageData.content}`)
    } catch (error) {
      console.error("Error handling message:", error)
      socket.emit("error", { message: "Failed to send message" })
    }
  })

  // Handle file uploads
  socket.on("uploadFile", async ({ messageId, fileName, fileData, fileType, fileSize, room, username }) => {
    try {
      const fileUrl = await FileController.saveFile(fileData, fileName, fileType)

      // Save file message to database
      const messageData = {
        username,
        content: fileName,
        room,
        messageType: fileType.startsWith("image/") ? "image" : "file",
        fileUrl,
        fileName,
        fileSize,
      }

      const savedMessage = await MessageController.saveMessage(messageData)

      const messageToSend = {
        id: savedMessage._id.toString(),
        username: savedMessage.username,
        content: savedMessage.content,
        room: savedMessage.room,
        type: savedMessage.messageType,
        timestamp: savedMessage.createdAt,
        fileUrl: savedMessage.fileUrl,
        fileName: savedMessage.fileName,
        fileSize: savedMessage.fileSize,
        reactions: [],
        readBy: [],
        status: "sent",
      }

      // Send file message to all users in the room
      io.to(room).emit("message", messageToSend)

      // Notify the sender that file was uploaded
      socket.emit("fileUploaded", { messageId, fileUrl, fileName, fileSize })

      console.log(`File uploaded by ${username} in ${room}: ${fileName}`)
    } catch (error) {
      console.error("Error handling file upload:", error)
      socket.emit("error", { message: "File upload failed" })
    }
  })

  // Handle typing indicators
  socket.on("typing", ({ username, room }) => {
    socket.broadcast.to(room).emit("userTyping", { username, room })
  })

  socket.on("stopTyping", ({ username, room }) => {
    socket.broadcast.to(room).emit("userStoppedTyping", { username, room })
  })

  // Handle message reactions
  socket.on("addReaction", async ({ messageId, reaction, username }) => {
    try {
      const updatedMessage = await MessageController.addReaction(messageId, reaction, username)

      if (updatedMessage) {
        io.emit("messageReaction", {
          messageId,
          reaction,
          username,
          reactions: updatedMessage.reactions,
        })
      }
    } catch (error) {
      console.error("Error handling reaction:", error)
    }
  })

  // Handle message search
  socket.on("searchMessages", async ({ query, room }) => {
    try {
      const results = await MessageController.searchMessages(query, room)
      socket.emit("searchResults", results)
    } catch (error) {
      console.error("Error searching messages:", error)
      socket.emit("error", { message: "Search failed" })
    }
  })

  // Handle getting message history (pagination)
  socket.on("getMessageHistory", async ({ room, page = 1 }) => {
    try {
      const messages = await MessageController.getMessages(room, page, 50)
      socket.emit("messageHistory", messages)
    } catch (error) {
      console.error("Error fetching message history:", error)
    }
  })

  // Handle message read receipts
  socket.on("markAsRead", async ({ messageId, username }) => {
    try {
      await MessageController.markAsRead(messageId, username)
      socket.broadcast.emit("messageRead", { messageId, username })
    } catch (error) {
      console.error("Error marking message as read:", error)
    }
  })

  // Handle disconnection
  socket.on("disconnect", async () => {
    try {
      const user = await UserController.setUserOffline(socket.id)

      if (user) {
        socket.broadcast.emit("userLeft", socket.id)

        // Send updated users list
        const onlineUsers = await UserController.getOnlineUsers()
        io.emit("usersUpdate", onlineUsers)

        console.log(`User disconnected: ${user.username}`)
      }
    } catch (error) {
      console.error("Error handling disconnect:", error)
    }
  })

  // Handle connection errors
  socket.on("error", (error) => {
    console.error("Socket error:", error)
  })
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Express error:", error)
  res.status(500).json({ error: "Internal server error" })
})

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`🚀 Socket.io server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`🗄️  MongoDB: ${process.env.MONGO_URI ? "Connected" : "Not configured"}`)
  console.log(`📁 Uploads directory: ${uploadsDir}`)
})

// Graceful shutdown
const gracefulShutdown = () => {
  console.log("🔄 Received shutdown signal, closing server gracefully...")

  server.close(() => {
    console.log("✅ HTTP server closed")
    process.exit(0)
  })

  // Force close after 10 seconds
  setTimeout(() => {
    console.error("❌ Could not close connections in time, forcefully shutting down")
    process.exit(1)
  }, 10000)
}

process.on("SIGTERM", gracefulShutdown)
process.on("SIGINT", gracefulShutdown)

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error)
  gracefulShutdown()
})

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason)
  gracefulShutdown()
})
