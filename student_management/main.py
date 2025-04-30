from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
import sqlite3
import os

app = FastAPI()
templates = Jinja2Templates(directory=".")

# Database initialization
DB_PATH = 'students.db'

def init_db():
    """Initialize the SQLite database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            date_of_birth DATE
        )
    ''')
    conn.commit()
    conn.close()

# Initialize database when the module is loaded
init_db()

@app.get("/", response_class=HTMLResponse)
async def read_students(request: Request):
    """Render the main page with student list"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM students")
    students = cursor.fetchall()
    conn.close()

    # Generate HTML
    html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Student Management</title>
      <style>
        body {{ 
          font-family: Arial, sans-serif; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
        }}
        table {{ 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 20px; 
        }}
        th, td {{ 
          border: 1px solid #ddd; 
          padding: 8px; 
          text-align: left; 
        }}
        form {{ 
          background: #f4f4f4; 
          padding: 20px; 
          border-radius: 5px; 
        }}
        input {{ 
          width: 100%; 
          padding: 10px; 
          margin: 10px 0; 
        }}
        button {{ 
          width: 100%; 
          padding: 10px; 
          background: #007bff; 
          color: white; 
          border: none; 
          cursor: pointer; 
        }}
      </style>
    </head>
    <body>
      <h1>🎓 Student Management</h1>
      
      <form action="/" method="post">
        <input type="text" name="first_name" placeholder="First Name" required>
        <input type="text" name="last_name" placeholder="Last Name" required>
        <input type="email" name="email" placeholder="Student Email" required>
        <input type="date" name="date_of_birth" placeholder="Date of Birth" required>
        <button type="submit">Add Student</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Date of Birth</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {''.join([f"""
            <tr>
              <td>{student[0]}</td>
              <td>{student[1]}</td>
              <td>{student[2]}</td>
              <td>{student[3]}</td>
              <td>{student[4]}</td>
              <td>
                <form action="/delete" method="post" style="margin:0; padding:0;">
                  <input type="hidden" name="id" value="{student[0]}">
                  <button type="submit" style="background:red;">Delete</button>
                </form>
              </td>
            </tr>
          """ for student in students])}
        </tbody>
      </table>
    </body>
    </html>
    """

    return HTMLResponse(content=html)

@app.post("/")
async def add_student(
    first_name: str = Form(...), 
    last_name: str = Form(...), 
    email: str = Form(...), 
    date_of_birth: str = Form(...)
):
    """Add a new student"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO students (first_name, last_name, email, date_of_birth) VALUES (?, ?, ?, ?)",
            (first_name, last_name, email, date_of_birth)
        )
        conn.commit()
        conn.close()
        return RedirectResponse("/", status_code=303)
    except sqlite3.IntegrityError as e:
        raise HTTPException(status_code=400, detail=f"Error adding student: {str(e)}")

@app.post("/delete")
async def delete_student(id: int = Form(...)):
    """Delete a student by ID"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM students WHERE id = ?", (id,))
        conn.commit()
        conn.close()
        return RedirectResponse("/", status_code=303)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error deleting student: {str(e)}")