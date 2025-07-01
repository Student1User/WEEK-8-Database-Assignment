import type { NextRequest } from "next/server"

// This is a mock implementation for the frontend demo
// In a real application, you would run this as a separate Node.js server

export async function GET(request: NextRequest) {
  return new Response("Socket.io server should be running separately on port 3001", {
    status: 200,
  })
}
