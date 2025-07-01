const fs = require("fs")
const path = require("path")
const crypto = require("crypto")

class FileController {
  static async saveFile(fileData, fileName, fileType) {
    try {
      // Remove data URL prefix if present
      const base64Data = fileData.replace(/^data:.*,/, "")

      // Generate unique filename
      const fileExtension = path.extname(fileName)
      const uniqueName = crypto.randomUUID() + fileExtension

      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(__dirname, "..", "uploads")
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }

      // Save file
      const filePath = path.join(uploadsDir, uniqueName)
      fs.writeFileSync(filePath, base64Data, "base64")

      // Return public URL
      return `/uploads/${uniqueName}`
    } catch (error) {
      console.error("Error saving file:", error)
      throw error
    }
  }

  static async deleteFile(fileUrl) {
    try {
      const fileName = path.basename(fileUrl)
      const filePath = path.join(__dirname, "..", "uploads", fileName)

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
        return true
      }

      return false
    } catch (error) {
      console.error("Error deleting file:", error)
      throw error
    }
  }

  static getFileInfo(fileUrl) {
    try {
      const fileName = path.basename(fileUrl)
      const filePath = path.join(__dirname, "..", "uploads", fileName)

      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath)
        return {
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
        }
      }

      return null
    } catch (error) {
      console.error("Error getting file info:", error)
      throw error
    }
  }
}

module.exports = FileController
