
# 🧑‍💻 📚📊 Week 8 Assignment – Power Learn Project (PLP)

---

```markdown
# 

This repository contains solutions for **both questions** in the **Week 8 Assignment** of the Power Learn Project (PLP) Software Engineering track – February Cohort 7.

---

## 🧩 Overview

| Question | Title                                | Technology Used       | Description                                  |
|----------|--------------------------------------|------------------------|----------------------------------------------|
| 1        | Library Management System (Database) | MySQL                 | Design and implement a relational DBMS       |
| 2        | Student Management System (API)      | FastAPI + MySQL       | CRUD API for managing student records        |

---

# 📘 Question One: Library Management System Database (MySQL)

## ✅ Description

A full-featured **relational database** designed to manage library operations including:

- Book cataloging (by category & author)
- Tracking members and staff
- Logging loans (borrow & return)

## 🧱 Schema Summary

| Table         | Description                                       |
|---------------|---------------------------------------------------|
| `authors`     | Stores book authors                               |
| `categories`  | Stores book genres/categories                     |
| `books`       | Stores book details                               |
| `book_author` | Many-to-Many relationship between books & authors |
| `members`     | Registered library members                        |
| `staff`       | Library staff                                     |
| `loans`       | Tracks book borrowings and returns                |

## 🔧 Key Features

- Primary & Foreign Keys for integrity
- Proper normalization (1NF–3NF)
- Sample `INSERT` data for testing
- SQL comments for clarity

## ▶️ How to Use

1. Open `library_management_system.sql` in MySQL Workbench (or any SQL client)
2. Execute the script to create and populate the database
3. Run test queries such as:

```sql
-- List all books and their authors
SELECT b.title, CONCAT(a.first_name, ' ', a.last_name) AS author
FROM books b
JOIN book_author ba ON b.book_id = ba.book_id
JOIN authors a ON ba.author_id = a.author_id;
```

---

# 🧑‍💻 Question Two: Student Management System API (FastAPI + MySQL)

## ✅ Description

A modern **CRUD RESTful API** built using **FastAPI** and connected to a **MySQL database**. It allows users to:

- ➕ Add new students
- 📋 Retrieve all or individual students
- ❌ Delete students

## 📦 Tech Stack

- **Backend:** Python (FastAPI)
- **Database:** MySQL
- **ORM:** SQLAlchemy
- **Validation:** Pydantic

## 🗃️ Student Table Schema

| Field         | Type         | Description              |
|---------------|--------------|--------------------------|
| `id`          | INT (PK)     | Auto-incremented ID      |
| `first_name`  | VARCHAR(100) | Student's first name     |
| `last_name`   | VARCHAR(100) | Student's last name      |
| `email`       | VARCHAR(100) | Unique student email     |
| `date_of_birth` | DATE       | Date of birth            |

## 📁 Project Structure

```
student-management/
├── main.py          # FastAPI routes
├── models.py        # SQLAlchemy models
├── schemas.py       # Pydantic schemas
├── database.py      # DB config
├── crud.py          # DB logic
└── requirements.txt
```

## ▶️ Running the API

### 1. Requirements

- Python 3
- MySQL
- Virtual environment

### 2. Setup

```bash
# Clone & navigate
git clone https://github.com/yourusername/Week-8-assignment-PLP.git
cd Week-8-assignment-PLP/student-management

# Create virtual environment
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Setup Database

- Create MySQL database:
```sql
CREATE DATABASE student_db;
```

- Update DB connection in `database.py`:
```python
DATABASE_URL = "mysql+mysqlconnector://username:password@localhost/student_db"
```

### 4. Run the API

```bash
uvicorn main:app --reload
```

### 5. Access API Docs

Open your browser:  
[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🧪 Sample API Request

**POST /students/**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "date_of_birth": "2000-01-01"
}
```

**GET /students/** – Retrieve all students  
**DELETE /students/{id}** – Delete student by ID

---

## 🧠 Author

**Name:** Emmanuel M Jesse  
**Cohort:** February Cohort 7 – PLP Software Engineering  
**Platform:** Power Learn Project (PLP)  
**Date:** April 2025

---

## 🔗 License

Licensed under the MIT License.  
For academic and educational use.
```
