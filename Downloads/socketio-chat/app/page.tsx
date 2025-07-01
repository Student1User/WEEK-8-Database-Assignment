"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { io, type Socket } from "socket.io-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Send,
  Users,
  MessageCircle,
  Heart,
  ThumbsUp,
  Smile,
  Paperclip,
  ImageIcon,
  Download,
  Search,
  Settings,
  Check,
  CheckCheck,
  Clock,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  username: string
  content: string
  timestamp: Date
  room: string
  type: "text" | "image" | "file" | "system"
  fileUrl?: string
  fileName?: string
  fileSize?: number
  reactions?: { [key: string]: string[] }
  readBy?: { username: string; readAt: Date }[]
  status?: "sending" | "sent" | "delivered" | "read"
}

interface User {
  id: string
  username: string
  online: boolean
  lastSeen?: Date
  avatar?: string
  status?: string
  typing?: boolean
}

interface TypingUser {
  username: string
  room: string
}

const AVATAR_COLORS = [
  "bg-gradient-to-br from-purple-500 to-pink-500",
  "bg-gradient-to-br from-blue-500 to-cyan-500",
  "bg-gradient-to-br from-green-500 to-emerald-500",
  "bg-gradient-to-br from-orange-500 to-red-500",
  "bg-gradient-to-br from-indigo-500 to-purple-500",
  "bg-gradient-to-br from-pink-500 to-rose-500",
  "bg-gradient-to-br from-teal-500 to-green-500",
  "bg-gradient-to-br from-yellow-500 to-orange-500",
]

const getAvatarColor = (username: string) => {
  const index = username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return AVATAR_COLORS[index % AVATAR_COLORS.length]
}

const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export default function ChatApp() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [username, setUsername] = useState("")
  const [userStatus, setUserStatus] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [currentRoom, setCurrentRoom] = useState("general")
  const [rooms] = useState([
    { id: "general", name: "General", description: "General discussion" },
    { id: "random", name: "Random", description: "Random topics" },
    { id: "tech", name: "Tech", description: "Technology discussions" },
  ])
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>({})
  const [isTyping, setIsTyping] = useState(false)
  const [privateChats, setPrivateChats] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Message[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected")

  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  const audioRef = useRef<HTMLAudioElement>()

  // Initialize audio for notifications
  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3")
    audioRef.current.volume = 0.5
  }, [])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:3001", {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    newSocket.on("connect", () => {
      console.log("Connected to server")
      setIsConnected(true)
      setConnectionStatus("connected")
      toast({
        title: "Connected",
        description: "Successfully connected to chat server",
      })
    })

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server")
      setIsConnected(false)
      setConnectionStatus("disconnected")
      toast({
        title: "Disconnected",
        description: "Connection lost. Attempting to reconnect...",
        variant: "destructive",
      })
    })

    newSocket.on("reconnect", () => {
      setConnectionStatus("connected")
      toast({
        title: "Reconnected",
        description: "Successfully reconnected to chat server",
      })
    })

    newSocket.on("message", (message: Message) => {
      setMessages((prev) => [...prev, { ...message, timestamp: new Date(message.timestamp) }])

      // Play notification sound
      if (soundEnabled && message.username !== username) {
        audioRef.current?.play().catch(console.error)
      }

      // Show notification if not in current room
      if (message.room !== currentRoom && message.username !== username) {
        setUnreadCounts((prev) => ({
          ...prev,
          [message.room]: (prev[message.room] || 0) + 1,
        }))

        // Browser notification
        if (notificationsEnabled && Notification.permission === "granted") {
          new Notification(`New message from ${message.username}`, {
            body: message.content,
            icon: "/favicon.ico",
            tag: `message-${message.id}`,
          })
        }

        toast({
          title: `New message in #${message.room}`,
          description: `${message.username}: ${message.content.substring(0, 50)}${message.content.length > 50 ? "..." : ""}`,
        })
      }
    })

    newSocket.on("userJoined", (user: User) => {
      setUsers((prev) => [...prev.filter((u) => u.id !== user.id), user])
      if (user.username !== username) {
        toast({
          title: "User joined",
          description: `${user.username} joined the chat`,
        })
      }
    })

    newSocket.on("userLeft", (userId: string) => {
      setUsers((prev) => {
        const user = prev.find((u) => u.id === userId)
        if (user && user.username !== username) {
          toast({
            title: "User left",
            description: `${user.username} left the chat`,
          })
        }
        return prev.filter((u) => u.id !== userId)
      })
    })

    newSocket.on("usersUpdate", (userList: User[]) => {
      setUsers(
        userList.map((user) => ({
          ...user,
          lastSeen: user.lastSeen ? new Date(user.lastSeen) : undefined,
        })),
      )
    })

    newSocket.on("userTyping", ({ username: typingUsername, room }: TypingUser) => {
      setTypingUsers((prev) => {
        const filtered = prev.filter((u) => u.username !== typingUsername || u.room !== room)
        return [...filtered, { username: typingUsername, room }]
      })
    })

    newSocket.on("userStoppedTyping", ({ username: typingUsername, room }: TypingUser) => {
      setTypingUsers((prev) => prev.filter((u) => u.username !== typingUsername || u.room !== room))
    })

    newSocket.on("messageReaction", ({ messageId, reaction, username: reactingUser, reactions }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === messageId) {
            return { ...msg, reactions }
          }
          return msg
        }),
      )
    })

    newSocket.on("messageHistory", (history: Message[]) => {
      setMessages(
        history.map((msg) => ({
          ...msg,
          id: msg.id || (msg as any)._id,
          timestamp: new Date(msg.timestamp || (msg as any).createdAt),
        })),
      )
      setLoadingHistory(false)
    })

    newSocket.on("searchResults", (results: Message[]) => {
      setSearchResults(
        results.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp || (msg as any).createdAt),
        })),
      )
      setIsSearching(false)
    })

    newSocket.on("fileUploaded", ({ messageId, fileUrl, fileName, fileSize }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, fileUrl, fileName, fileSize, status: "sent" } : msg)),
      )
    })

    newSocket.on("error", (error: { message: string }) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    })

    setSocket(newSocket)

    // Request notification permission
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        setNotificationsEnabled(permission === "granted")
      })
    }

    return () => {
      newSocket.close()
    }
  }, [])

  const login = () => {
    if (username.trim() && socket) {
      setConnectionStatus("connecting")
      socket.connect()
      socket.emit("join", { username, room: currentRoom, status: userStatus })
      setIsLoggedIn(true)
    }
  }

  const sendMessage = () => {
    if (currentMessage.trim() && socket && username) {
      const tempId = Date.now().toString()
      const message: Message = {
        id: tempId,
        username,
        content: currentMessage,
        room: currentRoom,
        timestamp: new Date(),
        type: "text",
        status: "sending",
      }

      // Optimistically add message
      setMessages((prev) => [...prev, message])

      socket.emit("message", message)
      setCurrentMessage("")

      // Stop typing
      if (isTyping) {
        socket.emit("stopTyping", { username, room: currentRoom })
        setIsTyping(false)
      }
    }
  }

  const handleTyping = (value: string) => {
    setCurrentMessage(value)

    if (socket && username) {
      if (value.trim() && !isTyping) {
        socket.emit("typing", { username, room: currentRoom })
        setIsTyping(true)
      } else if (!value.trim() && isTyping) {
        socket.emit("stopTyping", { username, room: currentRoom })
        setIsTyping(false)
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Set new timeout to stop typing after 3 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        if (isTyping) {
          socket.emit("stopTyping", { username, room: currentRoom })
          setIsTyping(false)
        }
      }, 3000)
    }
  }

  const switchRoom = (room: string) => {
    if (socket && username) {
      setLoadingHistory(true)
      socket.emit("leaveRoom", { username, room: currentRoom })
      socket.emit("joinRoom", { username, room })
      setCurrentRoom(room)
      setUnreadCounts((prev) => ({ ...prev, [room]: 0 }))

      if (isTyping) {
        socket.emit("stopTyping", { username, room: currentRoom })
        setIsTyping(false)
      }
    }
  }

  const startPrivateChat = (targetUser: string) => {
    const chatId = [username, targetUser].sort().join("-")
    if (!privateChats.includes(chatId)) {
      setPrivateChats((prev) => [...prev, chatId])
    }
    setCurrentRoom(chatId)
  }

  const addReaction = (messageId: string, reaction: string) => {
    if (socket) {
      socket.emit("addReaction", { messageId, reaction, username })
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && socket) {
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        const tempId = Date.now().toString()
        const message: Message = {
          id: tempId,
          username,
          content: file.name,
          room: currentRoom,
          timestamp: new Date(),
          type: file.type.startsWith("image/") ? "image" : "file",
          fileName: file.name,
          fileSize: file.size,
          status: "sending",
        }

        setMessages((prev) => [...prev, message])

        socket.emit("uploadFile", {
          messageId: tempId,
          fileName: file.name,
          fileData: reader.result,
          fileType: file.type,
          fileSize: file.size,
          room: currentRoom,
          username,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const searchMessages = (query: string) => {
    if (query.trim() && socket) {
      setIsSearching(true)
      socket.emit("searchMessages", { query, room: currentRoom })
    } else {
      setSearchResults([])
    }
  }

  const filteredMessages = messages.filter((msg) => msg.room === currentRoom)
  const currentTypingUsers = typingUsers.filter((u) => u.room === currentRoom && u.username !== username)

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to ChatFlow
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">Connect with others in real-time</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && login()}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status (optional)</Label>
              <Input
                id="status"
                placeholder="What's on your mind?"
                value={userStatus}
                onChange={(e) => setUserStatus(e.target.value)}
                className="h-12"
              />
            </div>
            <Button
              onClick={login}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium"
              disabled={!username.trim()}
            >
              Join Chat
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        darkMode
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100",
      )}
    >
      <div className="max-w-7xl mx-auto h-screen flex">
        {/* Sidebar */}
        <Card
          className={cn(
            "w-80 flex flex-col border-r-0 rounded-r-none shadow-lg",
            darkMode ? "bg-slate-800/90 border-slate-700" : "bg-white/90 border-slate-200",
          )}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">ChatFlow</CardTitle>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        connectionStatus === "connected"
                          ? "bg-green-500"
                          : connectionStatus === "connecting"
                            ? "bg-yellow-500"
                            : "bg-red-500",
                      )}
                    />
                    {connectionStatus === "connected"
                      ? "Connected"
                      : connectionStatus === "connecting"
                        ? "Connecting..."
                        : "Disconnected"}
                  </div>
                </div>
              </div>
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sound">Sound Notifications</Label>
                      <Switch id="sound" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifications">Browser Notifications</Label>
                      <Switch
                        id="notifications"
                        checked={notificationsEnabled}
                        onCheckedChange={setNotificationsEnabled}
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <div className="px-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  searchMessages(e.target.value)
                }}
                className="pl-10"
              />
            </div>
          </div>

          <CardContent className="flex-1 px-0">
            <div className="px-6 mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Online Users ({users.length})
              </h3>
            </div>
            <ScrollArea className="h-full px-6">
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200",
                      "hover:bg-slate-100 dark:hover:bg-slate-700/50",
                      user.username === username && "bg-blue-50 dark:bg-blue-900/20",
                    )}
                    onClick={() => user.username !== username && startPrivateChat(user.username)}
                  >
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback className={getAvatarColor(user.username)}>
                          <span className="text-white font-semibold">{user.username[0].toUpperCase()}</span>
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800",
                          user.online ? "bg-green-500" : "bg-slate-400",
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{user.username}</span>
                        {user.username === username && (
                          <Badge variant="secondary" className="text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                      {user.status && <p className="text-xs text-muted-foreground truncate">{user.status}</p>}
                      {!user.online && user.lastSeen && (
                        <p className="text-xs text-muted-foreground">Last seen {formatTime(user.lastSeen)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Main Chat */}
        <Card
          className={cn(
            "flex-1 flex flex-col rounded-l-none shadow-lg",
            darkMode ? "bg-slate-800/90 border-slate-700" : "bg-white/90 border-slate-200",
          )}
        >
          <CardHeader className="pb-4">
            <Tabs value={currentRoom} onValueChange={switchRoom}>
              <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-slate-700">
                {rooms.map((room) => (
                  <TabsTrigger
                    key={room.id}
                    value={room.id}
                    className="relative data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600"
                  >
                    #{room.name}
                    {unreadCounts[room.id] > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs animate-pulse"
                      >
                        {unreadCounts[room.id]}
                      </Badge>
                    )}
                  </TabsTrigger>
                ))}
                {privateChats.length > 0 && (
                  <TabsTrigger value={privateChats[0]} className="relative">
                    <MessageCircle className="w-4 h-4" />
                  </TabsTrigger>
                )}
              </TabsList>
            </Tabs>

            {/* Room description */}
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-muted-foreground">
                {rooms.find((r) => r.id === currentRoom)?.description || "Private conversation"}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {filteredMessages.length} messages
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {users.filter((u) => u.online).length} online
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-6 py-4">
                {loadingHistory && (
                  <div className="flex justify-center py-8">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      Loading messages...
                    </div>
                  </div>
                )}

                {filteredMessages.map((message, index) => {
                  const isOwn = message.username === username
                  const showAvatar = index === 0 || filteredMessages[index - 1].username !== message.username

                  return (
                    <div key={message.id} className={cn("flex gap-4 group", isOwn && "flex-row-reverse")}>
                      {showAvatar ? (
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarFallback className={getAvatarColor(message.username)}>
                            <span className="text-white font-semibold">{message.username[0].toUpperCase()}</span>
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-10 h-10 flex-shrink-0" />
                      )}

                      <div className={cn("flex-1 max-w-[70%]", isOwn && "flex flex-col items-end")}>
                        {showAvatar && (
                          <div className={cn("flex items-center gap-2 mb-1", isOwn && "flex-row-reverse")}>
                            <span className="font-semibold text-sm">{message.username}</span>
                            <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                          </div>
                        )}

                        <div
                          className={cn(
                            "relative rounded-2xl px-4 py-3 shadow-sm transition-all duration-200",
                            isOwn
                              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100",
                            "group-hover:shadow-md",
                          )}
                        >
                          {message.type === "image" && message.fileUrl && (
                            <div className="mb-2">
                              <img
                                src={message.fileUrl || "/placeholder.svg"}
                                alt={message.fileName}
                                className="max-w-full h-auto rounded-lg"
                                loading="lazy"
                              />
                            </div>
                          )}

                          {message.type === "file" && (
                            <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg mb-2">
                              <Paperclip className="w-5 h-5" />
                              <div className="flex-1">
                                <p className="font-medium">{message.fileName}</p>
                                <p className="text-xs opacity-75">
                                  {message.fileSize && formatFileSize(message.fileSize)}
                                </p>
                              </div>
                              {message.fileUrl && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-white hover:bg-white/20"
                                  onClick={() => window.open(message.fileUrl, "_blank")}
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          )}

                          <p className="break-words">{message.content}</p>

                          {/* Message status */}
                          {isOwn && (
                            <div className="flex items-center justify-end mt-1 gap-1">
                              {message.status === "sending" && <Clock className="w-3 h-3 opacity-60" />}
                              {message.status === "sent" && <Check className="w-3 h-3 opacity-60" />}
                              {message.status === "delivered" && <CheckCheck className="w-3 h-3 opacity-60" />}
                              {message.status === "read" && <CheckCheck className="w-3 h-3 text-blue-200" />}
                            </div>
                          )}

                          {/* Reactions */}
                          {message.reactions && Object.keys(message.reactions).length > 0 && (
                            <div className="flex gap-1 mt-2 flex-wrap">
                              {Object.entries(message.reactions).map(
                                ([reaction, users]) =>
                                  users.length > 0 && (
                                    <Button
                                      key={reaction}
                                      variant="secondary"
                                      size="sm"
                                      className="h-6 px-2 text-xs bg-white/20 hover:bg-white/30"
                                      onClick={() => addReaction(message.id, reaction)}
                                    >
                                      {reaction} {users.length}
                                    </Button>
                                  ),
                              )}
                            </div>
                          )}
                        </div>

                        {/* Reaction buttons */}
                        <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-slate-200 dark:hover:bg-slate-600"
                            onClick={() => addReaction(message.id, "👍")}
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-slate-200 dark:hover:bg-slate-600"
                            onClick={() => addReaction(message.id, "❤️")}
                          >
                            <Heart className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-slate-200 dark:hover:bg-slate-600"
                            onClick={() => addReaction(message.id, "😊")}
                          >
                            <Smile className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Typing indicators */}
                {currentTypingUsers.length > 0 && (
                  <div className="flex items-center gap-4">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-slate-200 dark:bg-slate-600">
                        <div className="flex gap-1">
                          <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" />
                          <div
                            className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl px-4 py-2">
                      <p className="text-sm text-muted-foreground italic">
                        {currentTypingUsers.map((u) => u.username).join(", ")}{" "}
                        {currentTypingUsers.length === 1 ? "is" : "are"} typing...
                      </p>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-end gap-3">
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    className="hidden"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-10 w-10 p-0"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      fileInputRef.current?.setAttribute("accept", "image/*")
                      fileInputRef.current?.click()
                    }}
                    className="h-10 w-10 p-0"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex-1 relative">
                  <Textarea
                    placeholder="Type your message..."
                    value={currentMessage}
                    onChange={(e) => handleTyping(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                    className="min-h-[44px] max-h-32 resize-none pr-12"
                    rows={1}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!currentMessage.trim()}
                    className="absolute right-2 bottom-2 h-8 w-8 p-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
