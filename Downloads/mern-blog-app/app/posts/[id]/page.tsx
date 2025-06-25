"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, MessageCircle, Eye, Heart, Share2, ArrowLeft, Send } from "lucide-react"
import Image from "next/image"

export default function PostDetailPage() {
  const params = useParams()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(0)

  // Mock post data
  const mockPost = {
    _id: params.id,
    title: "Building Scalable MERN Applications",
    content: `
# Building Scalable MERN Applications

The MERN stack (MongoDB, Express.js, React.js, Node.js) has become one of the most popular choices for building modern web applications. In this comprehensive guide, we'll explore how to architect and build production-ready MERN applications with best practices and modern tooling.

## Why Choose MERN Stack?

The MERN stack offers several advantages:

- **JavaScript Everywhere**: Use JavaScript for both frontend and backend development
- **Rich Ecosystem**: Leverage the vast npm ecosystem
- **Rapid Development**: Quick prototyping and development cycles
- **Scalability**: Built-in scalability features
- **Community Support**: Large, active community

## Architecture Overview

A well-structured MERN application typically follows this architecture:

### Frontend (React.js)
- Component-based architecture
- State management with Context API or Redux
- Routing with React Router
- Modern hooks and functional components

### Backend (Node.js + Express.js)
- RESTful API design
- Middleware for authentication and validation
- Error handling and logging
- Database integration

### Database (MongoDB)
- Document-based NoSQL database
- Flexible schema design
- Powerful aggregation framework
- Built-in replication and sharding

## Best Practices

### 1. Project Structure
Organize your project with clear separation of concerns:

\`\`\`
project/
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared utilities
└── docs/           # Documentation
\`\`\`

### 2. Environment Configuration
Use environment variables for configuration:

\`\`\`javascript
// server/.env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/myapp
JWT_SECRET=your-secret-key
\`\`\`

### 3. API Design
Follow RESTful conventions:

\`\`\`javascript
// User routes
GET    /api/users      # Get all users
GET    /api/users/:id  # Get user by ID
POST   /api/users      # Create new user
PUT    /api/users/:id  # Update user
DELETE /api/users/:id  # Delete user
\`\`\`

### 4. Error Handling
Implement comprehensive error handling:

\`\`\`javascript
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  })
}
\`\`\`

## Performance Optimization

### Frontend Optimization
- Code splitting with React.lazy()
- Memoization with React.memo()
- Virtual scrolling for large lists
- Image optimization and lazy loading

### Backend Optimization
- Database indexing
- Caching with Redis
- Connection pooling
- Compression middleware

### Database Optimization
- Proper indexing strategy
- Aggregation pipeline optimization
- Connection pooling
- Query optimization

## Security Considerations

Security should be a top priority:

1. **Authentication & Authorization**
   - JWT tokens for stateless authentication
   - Role-based access control
   - Secure password hashing

2. **Data Validation**
   - Input sanitization
   - Schema validation
   - SQL injection prevention

3. **HTTPS & CORS**
   - SSL/TLS encryption
   - Proper CORS configuration
   - Security headers

## Deployment Strategies

### Development Environment
- Docker containers for consistency
- Hot reloading for rapid development
- Environment-specific configurations

### Production Deployment
- CI/CD pipelines
- Load balancing
- Monitoring and logging
- Backup strategies

## Conclusion

Building scalable MERN applications requires careful planning, proper architecture, and adherence to best practices. By following the guidelines outlined in this article, you'll be well-equipped to create robust, maintainable, and scalable web applications.

Remember that scalability is not just about handling more users—it's also about maintaining code quality, team productivity, and system reliability as your application grows.
    `,
    author: {
      name: "John Doe",
      avatar: "/placeholder.svg",
      bio: "Full-stack developer with 10+ years of experience in MERN stack development.",
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    category: { name: "Development", slug: "development" },
    featuredImage: "/placeholder.svg?height=400&width=800",
    views: 1234,
    tags: ["MERN", "React", "Node.js", "MongoDB", "Express"],
    readTime: "12 min read",
  }

  const mockComments = [
    {
      _id: "1",
      content:
        "Excellent article! The architecture overview really helped me understand how to structure my MERN projects better.",
      author: { name: "Alice Johnson", avatar: "/placeholder.svg" },
      createdAt: "2024-01-16T09:30:00Z",
      likes: 5,
    },
    {
      _id: "2",
      content:
        "Thanks for sharing the best practices section. The error handling middleware example is particularly useful.",
      author: { name: "Bob Smith", avatar: "/placeholder.svg" },
      createdAt: "2024-01-16T14:15:00Z",
      likes: 3,
    },
    {
      _id: "3",
      content:
        "Great insights on performance optimization. I'll definitely implement some of these techniques in my current project.",
      author: { name: "Carol Davis", avatar: "/placeholder.svg" },
      createdAt: "2024-01-17T11:45:00Z",
      likes: 7,
    },
  ]

  useEffect(() => {
    // Simulate API call
    setLoading(true)
    setTimeout(() => {
      setPost(mockPost)
      setComments(mockComments)
      setLikes(Math.floor(Math.random() * 50) + 10)
      setLoading(false)
    }, 500)
  }, [params.id])

  const handleLike = () => {
    setLiked(!liked)
    setLikes((prev) => (liked ? prev - 1 : prev + 1))
  }

  const handleComment = () => {
    if (newComment.trim()) {
      const comment = {
        _id: Date.now().toString(),
        content: newComment,
        author: { name: "Current User", avatar: "/placeholder.svg" },
        createdAt: new Date().toISOString(),
        likes: 0,
      }
      setComments([comment, ...comments])
      setNewComment("")
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-4 w-1/4"></div>
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
            <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Post Not Found</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">The post you're looking for doesn't exist.</p>
          <Link href="/posts">
            <Button>Back to Posts</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/posts">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Posts
          </Button>
        </Link>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600">{post.category.name}</Badge>
              <span className="text-slate-500 text-sm">{post.readTime}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {post.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{post.author.name}</div>
                  <div className="text-sm text-slate-500">{post.author.bio}</div>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-slate-500">
                <div className="flex items-center space-x-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.views}</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative overflow-hidden rounded-lg mb-8">
              <Image
                src={post.featuredImage || "/placeholder.svg"}
                alt={post.title}
                width={800}
                height={400}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert mb-8">
            <div className="whitespace-pre-wrap">{post.content}</div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mb-8 p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <Button
                variant={liked ? "default" : "outline"}
                onClick={handleLike}
                className={liked ? "bg-red-500 hover:bg-red-600" : ""}
              >
                <Heart className={`h-4 w-4 mr-2 ${liked ? "fill-current" : ""}`} />
                {likes}
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            <div className="text-sm text-slate-500">{comments.length} comments</div>
          </div>

          <Separator className="mb-8" />

          {/* Comments Section */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Comments ({comments.length})</h2>

            {/* Add Comment */}
            <Card className="mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <h3 className="font-semibold">Add a comment</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Share your thoughts..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleComment} disabled={!newComment.trim()}>
                      <Send className="h-4 w-4 mr-2" />
                      Post Comment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <Card key={comment._id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {comment.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-slate-900 dark:text-white">{comment.author.name}</span>
                          <span className="text-sm text-slate-500">{formatDate(comment.createdAt)}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 mb-3">{comment.content}</p>
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm">
                            <Heart className="h-4 w-4 mr-1" />
                            {comment.likes}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </article>
      </div>
    </div>
  )
}
