import { type NextRequest, NextResponse } from "next/server"

const mockCategories = [
  {
    _id: "1",
    name: "Development",
    slug: "development",
    description: "General software development topics",
    color: "#3B82F6",
  },
  { _id: "2", name: "React", slug: "react", description: "React.js tutorials and best practices", color: "#61DAFB" },
  { _id: "3", name: "Node.js", slug: "nodejs", description: "Backend development with Node.js", color: "#339933" },
  { _id: "4", name: "Database", slug: "database", description: "Database design and optimization", color: "#FF6B35" },
  { _id: "5", name: "CSS", slug: "css", description: "Styling and frontend design", color: "#1572B6" },
  { _id: "6", name: "TypeScript", slug: "typescript", description: "TypeScript tips and techniques", color: "#3178C6" },
]

export async function GET() {
  try {
    return NextResponse.json(mockCategories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, color, icon } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    const newCategory = {
      _id: Date.now().toString(),
      name: name.trim(),
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      description: description?.trim() || "",
      color: color || "#3B82F6",
      icon: icon || "folder",
    }

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
