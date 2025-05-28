# School Planner Backend

A backend API for managing school data using ElysiaJS and MySQL.

## Prerequisites

-   Node.js and Bun installed
-   MySQL server running
-   The database schema from `db.sql` imported into your MySQL server

## Setup

1. Install dependencies:

```bash
bun install
```

2. Configure your database connection by editing the `.env` file with your MySQL credentials.

3. Start the development server:

```bash
bun run dev
```

## API Endpoints

### Teachers

-   GET `/teachers` - Get all teachers
-   POST `/teachers` - Create a new teacher

### Classes

-   GET `/classes` - Get all classes with teacher information
-   POST `/classes` - Create a new class

### Students

-   GET `/students` - Get all students with class information
-   POST `/students` - Create a new student

### Grades

-   GET `/grades` - Get all grades with student, subject, and teacher information
-   POST `/grades` - Create a new grade

## Example Usage

### Creating a Teacher

```bash
curl -X POST http://localhost:3000/teachers \
  -H "Content-Type: application/json" \
  -d '{"first_name": "John", "last_name": "Doe"}'
```

### Creating a Class

```bash
curl -X POST http://localhost:3000/classes \
  -H "Content-Type: application/json" \
  -d '{"class_name": "Class 1A", "teacher_id": 1}'
```

### Creating a Student

```bash
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{"first_name": "Jane", "last_name": "Smith", "birthdate": "2000-01-01", "class_id": 1}'
```

### Creating a Grade

```bash
curl -X POST http://localhost:3000/grades \
  -H "Content-Type: application/json" \
  -d '{"student_id": 1, "subject_id": 1, "teacher_id": 1, "grade": 4.5, "received": "2024-03-25"}'
```
