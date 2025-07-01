# 🚀 ChatFlow - Professional Real-Time Chat Application

A stunning, production-ready real-time chat application built with React, Next.js, Socket.io, and MongoDB. Features a modern UI/UX design with comprehensive chat functionality including file sharing, message reactions, and real-time notifications.

![ChatFlow Banner](https://via.placeholder.com/1200x400/4F46E5/FFFFFF?text=ChatFlow+-+Professional+Real-Time+Chat)

## ✨ Features

### 🎯 **Core Chat Functionality**
- ✅ **Real-time messaging** with Socket.io
- ✅ **User authentication** (username-based with status)
- ✅ **Multiple chat rooms** (General, Random, Tech)
- ✅ **Private messaging** between users
- ✅ **Online/offline status** with last seen timestamps
- ✅ **Typing indicators** with smart timeout
- ✅ **Message timestamps** with smart formatting

### 🚀 **Advanced Features**
- ✅ **File & Image sharing** with drag-and-drop support
- ✅ **Message reactions** (👍, ❤️, 😊) with real-time updates
- ✅ **Message search** across chat history
- ✅ **Message status** (sending, sent, delivered, read)
- ✅ **Read receipts** for message tracking
- ✅ **Message pagination** for performance
- ✅ **Sound notifications** with toggle control

### 🔔 **Real-Time Notifications**
- ✅ **Browser notifications** (Web Notifications API)
- ✅ **Toast notifications** for better UX
- ✅ **Unread message badges** with counts
- ✅ **User join/leave notifications**
- ✅ **Connection status** indicators

### 🎨 **Premium UI/UX**
- ✅ **Modern gradient design** with glassmorphism effects
- ✅ **Dark/Light mode** toggle
- ✅ **Responsive design** for all devices
- ✅ **Smooth animations** and micro-interactions
- ✅ **Professional avatar system** with gradient colors
- ✅ **Loading states** and error handling
- ✅ **Accessibility features** (ARIA labels, keyboard navigation)

### 🗄️ **Database & Performance**
- ✅ **MongoDB persistence** for all data
- ✅ **Message history** with pagination
- ✅ **User profiles** with preferences
- ✅ **File storage** with metadata
- ✅ **Search indexing** for fast queries
- ✅ **Connection pooling** and optimization

## 🛠️ Technology Stack

### Frontend
- **React 18** with Next.js 14 (App Router)
- **TypeScript** for type safety
- **Socket.io Client** for real-time communication
- **shadcn/ui** for premium UI components
- **Tailwind CSS** for styling with custom gradients
- **Lucide React** for consistent iconography

### Backend
- **Node.js** with Express.js
- **Socket.io** for WebSocket communication
- **MongoDB** with Mongoose ODM
- **Multer** for file upload handling
- **CORS** for cross-origin requests

### DevOps & Tools
- **Environment variables** for configuration
- **Error handling** and logging
- **Graceful shutdown** handling
- **Health check** endpoints

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### 🚀 Quick Start

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd socketio-chat
   \`\`\`

2. **Install frontend dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Install backend dependencies**
   \`\`\`bash
   cd scripts
   npm install
   \`\`\`

4. **Configure environment variables**
   \`\`\`bash
   # Create .env file in scripts directory
   cp .env.example .env
   
   # Add your MongoDB URI
   MONGO_URI=your_mongodb_connection_string
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   PORT=3001
   \`\`\`

5. **Start the development servers**
   \`\`\`bash
   # Terminal 1: Start the backend server
   cd scripts
   npm run dev
   
   # Terminal 2: Start the frontend (in project root)
   npm run dev
   \`\`\`

6. **Open your browser**
   \`\`\`
   Frontend: http://localhost:3000
   Backend API: http://localhost:3001
   \`\`\`

### 🔧 Configuration Options

\`\`\`env
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/chatflow

# Server Configuration
NODE_ENV=production|development
PORT=3001
CLIENT_URL=https://your-frontend-domain.com

# File Upload Configuration (optional)
MAX_FILE_SIZE=10485760  # 10MB in bytes
ALLOWED_FILE_TYPES=image/*,.pdf,.doc,.docx,.txt
\`\`\`

## 🎯 Usage Guide

### 💬 **Basic Chat**
1. Enter your username and optional status
2. Select a chat room from the tabs
3. Type messages and press Enter to send
4. See real-time messages from other users

### 📁 **File Sharing**
- Click the paperclip icon to upload any file
- Click the image icon to upload images specifically
- Drag and drop files directly into the chat
- Supported formats: Images, PDFs, Documents, Text files

### 💝 **Message Reactions**
- Hover over any message to see reaction buttons
- Click 👍, ❤️, or 😊 to add reactions
- Click existing reactions to toggle them on/off

### 🔍 **Search Messages**
- Use the search bar in the sidebar
- Search across all messages in the current room
- Results appear in real-time as you type

### ⚙️ **Settings**
- Click the settings icon to access preferences
- Toggle dark/light mode
- Enable/disable sound notifications
- Control browser notifications

## 🏗️ Architecture

### 📱 **Client-Side Architecture**
\`\`\`
app/
├── page.tsx                 # Main chat component
├── components/ui/           # shadcn/ui components
├── hooks/                   # Custom React hooks
└── lib/                     # Utility functions
\`\`\`

### 🖥️ **Server-Side Architecture**
\`\`\`
scripts/
├── server.js               # Main server file
├── config/
│   └── database.js         # MongoDB connection
├── controllers/
│   ├── messageController.js # Message CRUD operations
│   ├── userController.js   # User management
│   └── fileController.js   # File upload handling
├── models/
│   ├── Message.js          # Message schema
│   ├── User.js             # User schema
│   └── Room.js             # Room schema
└── uploads/                # File storage directory
\`\`\`

### 🔄 **Socket.io Events**
| Event | Description | Data |
|-------|-------------|------|
| `join` | User joins chat | `{ username, room, status }` |
| `message` | Send/receive messages | `{ username, content, room, type }` |
| `uploadFile` | File upload | `{ fileName, fileData, fileType, room }` |
| `typing` / `stopTyping` | Typing indicators | `{ username, room }` |
| `addReaction` | Message reactions | `{ messageId, reaction, username }` |
| `searchMessages` | Search functionality | `{ query, room }` |
| `markAsRead` | Read receipts | `{ messageId, username }` |

## 🚀 Deployment

### 🌐 **Frontend Deployment (Vercel)**
\`\`\`bash
# Build the application
npm run build

# Deploy to Vercel
npx vercel --prod

# Update Socket.io server URL in production
# Set NEXT_PUBLIC_SOCKET_URL environment variable
\`\`\`

### 🖥️ **Backend Deployment (Railway/Render)**
\`\`\`bash
# Deploy the scripts directory
cd scripts

# Set environment variables:
# MONGO_URI, NODE_ENV=production, CLIENT_URL, PORT

# Deploy using your preferred platform
\`\`\`

### 🗄️ **Database Setup (MongoDB Atlas)**
1. Create a MongoDB Atlas cluster
2. Create a database user
3. Whitelist your IP addresses
4. Get the connection string
5. Update `MONGO_URI` in your environment variables

## 🧪 Testing

### 🔍 **Manual Testing Checklist**
- [ ] User can join chat with username
- [ ] Messages send and receive in real-time
- [ ] File uploads work correctly
- [ ] Reactions add and remove properly
- [ ] Search returns accurate results
- [ ] Notifications appear correctly
- [ ] Dark/light mode toggles work
- [ ] Mobile responsiveness functions
- [ ] Connection recovery works
- [ ] Error handling displays properly

### 🤖 **Automated Testing** (Future Enhancement)
\`\`\`bash
# Frontend tests
npm run test

# Backend tests
cd scripts && npm run test

# E2E tests
npm run test:e2e
\`\`\`

## 🔒 Security Features

- **Input sanitization** for XSS prevention
- **File type validation** for upload security
- **Rate limiting** for spam protection
- **CORS configuration** for origin control
- **Environment variable** protection
- **Error message** sanitization

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### 📝 **Development Guidelines**
- Follow TypeScript best practices
- Use meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Socket.io** for real-time communication
- **MongoDB** for data persistence
- **shadcn/ui** for beautiful components
- **Vercel** for hosting and deployment
- **The open-source community** for inspiration

## 📞 Support

If you encounter any issues or have questions:

1. **Check the documentation** above
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information
4. **Join our community** discussions

---

<div align="center">

**Built with ❤️ for the developer community**

[⭐ Star this repo](https://github.com/your-username/chatflow) | [🐛 Report Bug](https://github.com/your-username/chatflow/issues) | [💡 Request Feature](https://github.com/your-username/chatflow/issues)

</div>
