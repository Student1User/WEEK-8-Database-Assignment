import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Comment from "@/models/Comment"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("postId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    const skip = (page - 1) * limit

    const comments = await Comment.find({
      post: postId,
      parent: null, // Only top-level comments
      status: "approved",
    })
      .populate("author", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Comment.countDocuments({
      post: postId,
      parent: null,
      status: "approved",
    })

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { content, postId, parentId } = await request.json()

    // TODO: Get user from JWT token
    const userId = "temp-user-id" // This should come from authentication

    if (!content || !postId) {
      return NextResponse.json({ error: "Content and post ID are required" }, { status: 400 })
    }

    const comment = new Comment({
      content: content.trim(),
      author: userId,
      post: postId,
      parent: parentId || null,
      status: "approved", // Auto-approve for demo
    })

    await comment.save()
    await comment.populate("author", "name avatar")

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}
