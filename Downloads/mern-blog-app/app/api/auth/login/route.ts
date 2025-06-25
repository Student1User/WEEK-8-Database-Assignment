import { type NextRequest, NextResponse } from "next/server"

// Simple in-memory user storage (replace with real database in production)
const users = new Map()

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user
    const user = users.get(email.toLowerCase())
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check password (in production, use bcrypt)
    if (user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate simple token (in production, use JWT)
    const token = `token_${user.id}_${Date.now()}`

    // Return user data (without password)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
    }

    return NextResponse.json({
      message: "Login successful",
      user: userData,
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
