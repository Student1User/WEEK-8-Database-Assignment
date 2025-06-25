"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, FileText, Eye, MessageCircle, Heart, TrendingUp, Calendar, Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalComments: 0,
    totalLikes: 0,
  })

  // Mock user data
  const mockUser = {
    id: "1",
    name: "Demo User",
    email: "demo@example.com",
    avatar: "/placeholder.svg",
    bio: "Full-stack developer passionate about sharing knowledge and building amazing web applications.",
    joinedAt: "2024-01-01T00:00:00Z",
  }

  // Mock posts data
  const mockPosts = [
    {
      _id: "1",
      title: "Building Scalable MERN Applications",
      excerpt: "Learn how to architect and build production-ready MERN stack applications...",
      status: "published",
      createdAt: "2024-01-15T10:00:00Z",
      views: 1234,
      comments: 23,
      likes: 45,
      category: "Development",
    },
    {
      _id: "2",
      title: "Advanced React Patterns",
      excerpt: "Dive deep into advanced React patterns and custom hooks...",
      status: "published",
      createdAt: "2024-01-12T14:30:00Z",
      views: 987,
      comments: 15,
      likes: 32,
      category: "React",
    },
    {
      _id: "3",
      title: "MongoDB Performance Tips",
      excerpt: "Master MongoDB indexing and query optimization...",
      status: "draft",
      createdAt: "2024-01-10T09:15:00Z",
      views: 0,
      comments: 0,
      likes: 0,
      category: "Database",
    },
  ]

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (!userData || !token) {
      router.push("/auth/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Fetch user's posts
    const fetchUserPosts = async () => {
      try {
        const response = await fetch(`/api/posts?authorId=${parsedUser.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setPosts(data.posts)

          // Calculate stats
          setStats({
            totalPosts: data.posts.length,
            totalViews: data.posts.reduce((sum, post) => sum + (post.views || 0), 0),
            totalComments: data.posts.reduce((sum, post) => sum + (post.comments || 0), 0),
            totalLikes: data.posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0),
          })
        }
      } catch (error) {
        console.error("Error fetching user posts:", error)
      }
    }

    fetchUserPosts()
  }, [router])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-300">
              Welcome back, {user.name}! Here's what's happening with your content.
            </p>
          </div>
          <Link href="/dashboard/posts/new">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Posts</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalPosts}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Views</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {stats.totalViews.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <Eye className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Comments</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalComments}</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <MessageCircle className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Likes</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalLikes}</p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                  <Heart className="h-6 w-6 text-red-600 dark:text-red-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="posts" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="posts">My Posts</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Posts</h2>
                  <Link href="/dashboard/posts">
                    <Button variant="outline">View All</Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {posts.map((post) => (
                    <Card key={post._id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge className={getStatusColor(post.status)}>{post.status}</Badge>
                              <Badge variant="secondary">{post.category?.name || post.category}</Badge>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                              <Link href={`/posts/${post._id}`} className="hover:text-blue-600">
                                {post.title}
                              </Link>
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">{post.excerpt}</p>
                            <div className="flex items-center space-x-4 text-sm text-slate-500">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(post.createdAt)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Eye className="h-4 w-4" />
                                <span>{post.views}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MessageCircle className="h-4 w-4" />
                                <span>{post.comments}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Heart className="h-4 w-4" />
                                <span>{post.likes}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Link href={`/dashboard/posts/${post._id}/edit`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Performance Overview</span>
                    </CardTitle>
                    <CardDescription>Your content performance over the last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">+23%</div>
                          <div className="text-sm text-slate-600 dark:text-slate-300">Views Growth</div>
                        </div>
                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">+15%</div>
                          <div className="text-sm text-slate-600 dark:text-slate-300">Engagement</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-slate-900 dark:text-white">Top Performing Posts</h4>
                        {posts.slice(0, 3).map((post, index) => (
                          <div
                            key={post._id}
                            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {index + 1}
                              </div>
                              <div>
                                <div className="font-medium text-slate-900 dark:text-white line-clamp-1">
                                  {post.title}
                                </div>
                                <div className="text-sm text-slate-500">{post.views} views</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{user.name}</h3>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{user.bio}</p>
                <Link href="/dashboard/profile">
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/dashboard/posts/new">
                  <Button variant="outline" className="w-full justify-start">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Write New Post
                  </Button>
                </Link>
                <Link href="/dashboard/posts">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Manage Posts
                  </Button>
                </Link>
                <Link href="/dashboard/settings">
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
