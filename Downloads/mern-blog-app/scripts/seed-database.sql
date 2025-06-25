-- Create sample categories
INSERT INTO categories (name, slug, description, color, icon) VALUES
('Development', 'development', 'General software development topics', '#3B82F6', 'code'),
('React', 'react', 'React.js tutorials and best practices', '#61DAFB', 'react'),
('Node.js', 'nodejs', 'Backend development with Node.js', '#339933', 'server'),
('Database', 'database', 'Database design and optimization', '#FF6B35', 'database'),
('CSS', 'css', 'Styling and frontend design', '#1572B6', 'palette'),
('TypeScript', 'typescript', 'TypeScript tips and techniques', '#3178C6', 'type'),
('API', 'api', 'API design and development', '#FF6B6B', 'api');

-- Create sample users
INSERT INTO users (name, email, password, bio, avatar, role, isVerified) VALUES
('John Doe', 'john@example.com', '$2b$10$hashedpassword1', 'Full-stack developer with 10+ years of experience', '/placeholder.svg', 'user', true),
('Jane Smith', 'jane@example.com', '$2b$10$hashedpassword2', 'Frontend specialist and React enthusiast', '/placeholder.svg', 'user', true),
('Mike Johnson', 'mike@example.com', '$2b$10$hashedpassword3', 'Database architect and performance expert', '/placeholder.svg', 'user', true),
('Sarah Wilson', 'sarah@example.com', '$2b$10$hashedpassword4', 'UI/UX designer and CSS expert', '/placeholder.svg', 'user', true),
('David Brown', 'david@example.com', '$2b$10$hashedpassword5', 'TypeScript advocate and clean code enthusiast', '/placeholder.svg', 'user', true);

-- Create sample posts
INSERT INTO posts (title, slug, excerpt, content, author_id, category_id, tags, featuredImage, status, views, readTime, publishedAt) VALUES
(
  'Building Scalable MERN Applications',
  'building-scalable-mern-applications',
  'Learn how to architect and build production-ready MERN stack applications with best practices and modern tooling.',
  'Full content for MERN applications article...',
  1,
  1,
  '["MERN", "React", "Node.js", "MongoDB", "Express"]',
  '/placeholder.svg?height=400&width=800',
  'published',
  1234,
  12,
  NOW()
),
(
  'Advanced React Patterns and Hooks',
  'advanced-react-patterns-and-hooks',
  'Dive deep into advanced React patterns, custom hooks, and performance optimization techniques.',
  'Full content for React patterns article...',
  2,
  2,
  '["React", "Hooks", "Performance", "Patterns"]',
  '/placeholder.svg?height=400&width=800',
  'published',
  987,
  10,
  NOW()
),
(
  'MongoDB Performance Optimization',
  'mongodb-performance-optimization',
  'Master MongoDB indexing, aggregation pipelines, and query optimization for high-performance applications.',
  'Full content for MongoDB optimization article...',
  3,
  4,
  '["MongoDB", "Performance", "Database", "Indexing"]',
  '/placeholder.svg?height=400&width=800',
  'published',
  756,
  8,
  NOW()
);

-- Create sample comments
INSERT INTO comments (content, author_id, post_id, status) VALUES
('Excellent article! The architecture overview really helped me understand how to structure my MERN projects better.', 2, 1, 'approved'),
('Thanks for sharing the best practices section. The error handling middleware example is particularly useful.', 3, 1, 'approved'),
('Great insights on performance optimization. I will definitely implement some of these techniques in my current project.', 4, 1, 'approved'),
('The React patterns you described are exactly what I was looking for. Thanks for the detailed examples!', 1, 2, 'approved'),
('Could you elaborate more on the custom hooks section? I would love to see more examples.', 5, 2, 'approved'),
('MongoDB indexing strategies are often overlooked. This article provides great practical advice.', 1, 3, 'approved');
