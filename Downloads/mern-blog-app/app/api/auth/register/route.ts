import { type NextRequest, NextResponse } from "next/server"

// Simple in-memory user storage (replace with real database in production)
const users = new Map()

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Check if user already exists
    if (users.has(email.toLowerCase())) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 })
    }

    // Create user
    const userId = Date.now().toString()
    const userData = {
      id: userId,
      name: name.trim(),
      email: email.toLowerCase(),
      password: password, // In production, hash this with bcrypt
      avatar: "/placeholder.svg",
      bio: "",
      role: "user",
      createdAt: new Date().toISOString(),
    }

    // Store user
    users.set(email.toLowerCase(), userData)

    // Generate simple token (in production, use JWT)
    const token = `token_${userId}_${Date.now()}`

    // Return user data (without password)
    const userResponse = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar,
      bio: userData.bio,
      role: userData.role,
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userResponse,
        token,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
