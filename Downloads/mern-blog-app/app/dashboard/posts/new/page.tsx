"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, Eye } from "lucide-react"

export default function NewPostPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    featuredImage: "",
    status: "draft",
    publishToHome: true,
  })

  const categories = [
    "Development",
    "React",
    "Node.js",
    "Database",
    "CSS",
    "TypeScript",
    "API",
    "DevOps",
    "Mobile",
    "AI/ML",
  ]

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (!userData || !token) {
      router.push("/auth/login")
      return
    }

    setUser(JSON.parse(userData))
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e, publishStatus = "draft") => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Please log in to create a post")
        return
      }

      const postData = {
        ...formData,
        status: publishStatus,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create post")
        return
      }

      setSuccess(`Post ${publishStatus === "published" ? "published" : "saved as draft"} successfully!`)

      // Redirect after success
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
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
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Create New Post</h1>
              <p className="text-slate-600 dark:text-slate-300">Share your knowledge with the community</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50 text-green-800">
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={(e) => handleSubmit(e, "draft")} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter your post title..."
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt *</Label>
                    <Textarea
                      id="excerpt"
                      name="excerpt"
                      placeholder="Write a brief description of your post..."
                      value={formData.excerpt}
                      onChange={handleChange}
                      required
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      name="content"
                      placeholder="Write your post content here... (Supports Markdown)"
                      value={formData.content}
                      onChange={handleChange}
                      required
                      rows={15}
                      className="font-mono"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <Input
                        id="tags"
                        name="tags"
                        placeholder="react, javascript, tutorial (comma separated)"
                        value={formData.tags}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="featuredImage">Featured Image URL</Label>
                    <Input
                      id="featuredImage"
                      name="featuredImage"
                      placeholder="https://example.com/image.jpg"
                      value={formData.featuredImage}
                      onChange={handleChange}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Options */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle>Publish Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="publishToHome">Show on Homepage</Label>
                  <Switch
                    id="publishToHome"
                    checked={formData.publishToHome}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, publishToHome: checked }))}
                  />
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={(e) => handleSubmit(e, "draft")}
                    disabled={loading}
                    variant="outline"
                    className="w-full"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Saving..." : "Save as Draft"}
                  </Button>

                  <Button
                    onClick={(e) => handleSubmit(e, "published")}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {loading ? "Publishing..." : "Publish Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Author Info */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle>Author</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">{user.name}</div>
                    <div className="text-sm text-slate-500">{user.email}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle>Writing Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                <p>• Use clear, descriptive titles</p>
                <p>• Write engaging excerpts to attract readers</p>
                <p>• Add relevant tags for better discoverability</p>
                <p>• Include code examples when applicable</p>
                <p>• Proofread before publishing</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
