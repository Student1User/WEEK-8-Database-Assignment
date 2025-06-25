import { type NextRequest, NextResponse } from "next/server"

// Simple in-memory post storage (same as in route.ts)
const posts = new Map()

// Helper function to get user from token
function getUserFromToken(token: string) {
  if (!token || !token.startsWith("token_")) return null
  const parts = token.split("_")
  return { userId: parts[1] }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const post = posts.get(params.id)

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Increment view count
    post.views += 1
    posts.set(params.id, post)

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const post = posts.get(params.id)
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Check if user owns the post
    if (post.author.id !== user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { title, content, excerpt, category, tags, featuredImage, status, publishToHome } = body

    // Update post
    const updatedPost = {
      ...post,
      title: title || post.title,
      content: content || post.content,
      excerpt: excerpt || post.excerpt,
      category: category
        ? {
            name: category,
            slug: category.toLowerCase().replace(/\s+/g, "-"),
          }
        : post.category,
      tags: tags || post.tags,
      featuredImage: featuredImage || post.featuredImage,
      status: status || post.status,
      publishToHome: publishToHome !== undefined ? publishToHome : post.publishToHome,
      updatedAt: new Date().toISOString(),
      publishedAt: status === "published" && !post.publishedAt ? new Date().toISOString() : post.publishedAt,
    }

    posts.set(params.id, updatedPost)

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const post = posts.get(params.id)
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Check if user owns the post
    if (post.author.id !== user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    posts.delete(params.id)

    return NextResponse.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
