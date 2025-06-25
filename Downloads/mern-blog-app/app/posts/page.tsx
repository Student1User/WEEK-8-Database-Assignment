"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, MessageCircle, Eye, Search, Filter, ArrowLeft, ArrowRight } from "lucide-react"
import Image from "next/image"

export default function PostsPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Mock data for demonstration
  const mockPosts = [
    {
      _id: "1",
      title: "Building Scalable MERN Applications",
      excerpt:
        "Learn how to architect and build production-ready MERN stack applications with best practices and modern tooling.",
      content: "Full content here...",
      author: { name: "John Doe", avatar: "/placeholder.svg" },
      createdAt: "2024-01-15T10:00:00Z",
      category: { name: "Development", slug: "development" },
      featuredImage: "/placeholder.svg?height=200&width=400",
      views: 1234,
      comments: 23,
      tags: ["MERN", "React", "Node.js"],
    },
    {
      _id: "2",
      title: "Advanced React Patterns and Hooks",
      excerpt:
        "Dive deep into advanced React patterns, custom hooks, and performance optimization techniques for modern web applications.",
      content: "Full content here...",
      author: { name: "Jane Smith", avatar: "/placeholder.svg" },
      createdAt: "2024-01-12T14:30:00Z",
      category: { name: "React", slug: "react" },
      featuredImage: "/placeholder.svg?height=200&width=400",
      views: 987,
      comments: 15,
      tags: ["React", "Hooks", "Performance"],
    },
    {
      _id: "3",
      title: "MongoDB Performance Optimization",
      excerpt:
        "Master MongoDB indexing, aggregation pipelines, and query optimization for high-performance applications.",
      content: "Full content here...",
      author: { name: "Mike Johnson", avatar: "/placeholder.svg" },
      createdAt: "2024-01-10T09:15:00Z",
      category: { name: "Database", slug: "database" },
      featuredImage: "/placeholder.svg?height=200&width=400",
      views: 756,
      comments: 8,
      tags: ["MongoDB", "Performance", "Database"],
    },
    {
      _id: "4",
      title: "Modern CSS Grid and Flexbox Techniques",
      excerpt: "Explore advanced CSS layout techniques using Grid and Flexbox for responsive web design.",
      content: "Full content here...",
      author: { name: "Sarah Wilson", avatar: "/placeholder.svg" },
      createdAt: "2024-01-08T16:45:00Z",
      category: { name: "CSS", slug: "css" },
      featuredImage: "/placeholder.svg?height=200&width=400",
      views: 543,
      comments: 12,
      tags: ["CSS", "Grid", "Flexbox"],
    },
    {
      _id: "5",
      title: "TypeScript Best Practices for Large Applications",
      excerpt: "Learn how to structure and organize TypeScript code for maintainable large-scale applications.",
      content: "Full content here...",
      author: { name: "David Brown", avatar: "/placeholder.svg" },
      createdAt: "2024-01-05T11:20:00Z",
      category: { name: "TypeScript", slug: "typescript" },
      featuredImage: "/placeholder.svg?height=200&width=400",
      views: 892,
      comments: 19,
      tags: ["TypeScript", "Architecture", "Best Practices"],
    },
    {
      _id: "6",
      title: "API Design and Documentation with OpenAPI",
      excerpt: "Create well-designed APIs with proper documentation using OpenAPI specification and best practices.",
      content: "Full content here...",
      author: { name: "Lisa Garcia", avatar: "/placeholder.svg" },
      createdAt: "2024-01-03T13:10:00Z",
      category: { name: "API", slug: "api" },
      featuredImage: "/placeholder.svg?height=200&width=400",
      views: 678,
      comments: 7,
      tags: ["API", "OpenAPI", "Documentation"],
    },
  ]

  const categories = [
    { name: "All", slug: "all" },
    { name: "Development", slug: "development" },
    { name: "React", slug: "react" },
    { name: "Database", slug: "database" },
    { name: "CSS", slug: "css" },
    { name: "TypeScript", slug: "typescript" },
    { name: "API", slug: "api" },
  ]

  useEffect(() => {
    // Simulate API call
    setLoading(true)

    const fetchPosts = async () => {
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: "6",
          status: "published", // Only published posts
        })

        if (searchTerm) params.append("search", searchTerm)
        if (selectedCategory !== "all") params.append("category", selectedCategory)

        const response = await fetch(`/api/posts?${params}`)

        if (response.ok) {
          const data = await response.json()
          setPosts(data.posts)
          setTotalPages(data.pagination.pages)
        } else {
          setPosts([])
        }
      } catch (error) {
        console.error("Error fetching posts:", error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [searchTerm, selectedCategory, currentPage])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">All Posts</h1>
              <p className="text-slate-600 dark:text-slate-300">
                Discover insights, tutorials, and experiences from our developer community
              </p>
            </div>
            <Link href="/dashboard/posts/new">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Write Post
              </Button>
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search posts, tags, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-slate-800"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 bg-white dark:bg-slate-800">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.slug} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-1"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">No posts found</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">Try adjusting your search or filter criteria</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
                setCurrentPage(1)
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card
                  key={post._id}
                  className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={post.featuredImage || "/placeholder.svg"}
                      alt={post.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600">
                      {post.category?.name || post.category}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors line-clamp-2">
                      <Link href={`/posts/${post._id}`}>{post.title}</Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {post.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-slate-600 dark:text-slate-300">{post.author.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <CalendarDays className="h-4 w-4" />
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
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-white dark:bg-slate-800"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <div className="flex space-x-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      onClick={() => setCurrentPage(i + 1)}
                      className={
                        currentPage === i + 1
                          ? "bg-gradient-to-r from-blue-600 to-purple-600"
                          : "bg-white dark:bg-slate-800"
                      }
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="bg-white dark:bg-slate-800"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
