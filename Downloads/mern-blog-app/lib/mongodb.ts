// Mock MongoDB connection for v0 environment
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://emmanueljesse:UkN36KPhEOQ4XD3z@blogcluster.aafqjer.mongodb.net/blogDB?retryWrites=true&w=majority"

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

// Mock connection for v0 environment
export async function connectDB() {
  console.log("Mock MongoDB connection established")
  return Promise.resolve(true)
}
