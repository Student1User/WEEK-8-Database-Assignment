import { type NextRequest, NextResponse } from "next/server"

// Simple in-memory post storage (replace with real database in production)
const posts = new Map()

// Helper function to get user from token
function getUserFromToken(token: string) {
  if (!token || !token.startsWith("token_")) return null
  const parts = token.split("_")
  return { userId: parts[1] }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const authorId = searchParams.get("authorId") // For getting user's own posts
    const status = searchParams.get("status") || "published" // Default to published posts

    let allPosts = Array.from(posts.values())

    // Filter by author if specified (for dashboard)
    if (authorId) {
      allPosts = allPosts.filter((post) => post.author.id === authorId)
    } else {
      // For public view, only show published posts
      allPosts = allPosts.filter((post) => post.status === "published")
    }

    // Filter by category
    if (category && category !== "all") {
      allPosts = allPosts.filter((post) => post.category.slug === category)
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase()
      allPosts = allPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      )
    }

    // Sort by creation date (newest first)
    allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Pagination
    const skip = (page - 1) * limit
    const paginatedPosts = allPosts.slice(skip, skip + limit)

    return NextResponse.json({
      posts: paginatedPosts,
      pagination: {
        page,
        limit,
        total: allPosts.length,
        pages: Math.ceil(allPosts.length / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Authorization required" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const user = getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, excerpt, category, tags, featuredImage, status = "draft", publishToHome = true } = body

    // Validation
    if (!title || !content || !excerpt) {
      return NextResponse.json({ error: "Title, content, and excerpt are required" }, { status: 400 })
    }

    // Create post
    const postId = Date.now().toString()
    const newPost = {
      _id: postId,
      title: title.trim(),
      slug: title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .replace(/\s+/g, "-"),
      content,
      excerpt: excerpt.trim(),
      author: {
        id: user.userId,
        name: "Current User", // In production, get from user database
        email: "user@example.com",
        avatar: "/placeholder.svg",
      },
      category: {
        name: category || "General",
        slug: (category || "general").toLowerCase().replace(/\s+/g, "-"),
      },
      tags: tags || [],
      featuredImage: featuredImage || "/placeholder.svg?height=400&width=800",
      status,
      publishToHome,
      views: 0,
      likes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: status === "published" ? new Date().toISOString() : null,
    }

    // Store post
    posts.set(postId, newPost)

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
