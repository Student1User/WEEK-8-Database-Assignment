import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, MessageCircle, Eye, ArrowRight, PenTool, Users, BookOpen } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  // Mock data for featured posts
  const featuredPosts = [
    {
      id: 1,
      title: "Building Scalable MERN Applications",
      excerpt:
        "Learn how to architect and build production-ready MERN stack applications with best practices and modern tooling.",
      author: "John Doe",
      date: "2024-01-15",
      category: "Development",
      readTime: "8 min read",
      views: 1234,
      comments: 23,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 2,
      title: "Advanced React Patterns and Hooks",
      excerpt:
        "Dive deep into advanced React patterns, custom hooks, and performance optimization techniques for modern web applications.",
      author: "Jane Smith",
      date: "2024-01-12",
      category: "React",
      readTime: "12 min read",
      views: 987,
      comments: 15,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 3,
      title: "MongoDB Performance Optimization",
      excerpt:
        "Master MongoDB indexing, aggregation pipelines, and query optimization for high-performance applications.",
      author: "Mike Johnson",
      date: "2024-01-10",
      category: "Database",
      readTime: "10 min read",
      views: 756,
      comments: 8,
      image: "/placeholder.svg?height=200&width=400",
    },
  ]

  const stats = [
    { icon: BookOpen, label: "Articles", value: "150+" },
    { icon: Users, label: "Authors", value: "25+" },
    { icon: MessageCircle, label: "Comments", value: "1.2K+" },
    { icon: Eye, label: "Monthly Views", value: "50K+" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PenTool className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DevBlog
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/posts"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                Posts
              </Link>
              <Link
                href="/categories"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                Categories
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" className="bg-white text-slate-900 border-slate-200 hover:bg-slate-50">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-white dark:via-blue-400 dark:to-purple-400">
              Share Your Code Journey
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              A modern platform for developers to share insights, tutorials, and experiences. Built with the MERN stack
              for the developer community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/posts">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3"
                >
                  Explore Posts
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-slate-900 border-slate-200 hover:bg-slate-50 text-lg px-8 py-3"
                >
                  Start Writing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mb-4">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{stat.value}</div>
                <div className="text-slate-600 dark:text-slate-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Featured Articles</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Discover the latest insights and tutorials from our community of developers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <Card
                key={post.id}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600">
                    {post.category}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>
                          {post.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-slate-600 dark:text-slate-300">{post.author}</span>
                    </div>
                    <span className="text-sm text-slate-500">{post.readTime}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <CalendarDays className="h-4 w-4" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
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
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/posts">
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-slate-900 border-slate-200 hover:bg-slate-50"
              >
                View All Posts
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Share Your Knowledge?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our community of developers and start sharing your coding journey, tutorials, and insights with the
            world.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <PenTool className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">DevBlog</span>
              </div>
              <p className="text-slate-400">A modern platform for developers to share knowledge and grow together.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/posts" className="hover:text-white transition-colors">
                    Browse Posts
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="hover:text-white transition-colors">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    Write
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/guidelines" className="hover:text-white transition-colors">
                    Guidelines
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Account</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/auth/login" className="hover:text-white transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="hover:text-white transition-colors">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-white transition-colors">
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 DevBlog. Built with MERN Stack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
