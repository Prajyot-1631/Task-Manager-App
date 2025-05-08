# Task Manager System 🗂️

A simple task management system for small teams. Built with Node.js, Express, MongoDB, and planned frontend integration.

## 🔧 Features

- User Registration & Login (JWT Authentication)
- Create, Read, Update, Delete (CRUD) tasks
- Task assignment to specific users
- MongoDB for database

## 🛠️ Tech Stack

- Backend: Node.js, Express.js, MongoDB, Mongoose
- Frontend: (Coming Soon)
- Authentication: JWT

## 📦 Installation

```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager
npm install


 Create a .env file in /backend:
 PORT=8080
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret


Run the Server
cd backend
node index.js

Server runs at: http://localhost:8080


API Endpoints

Auth
POST /register – Register a new user

POST /login – Login user

Tasks (protected routes)
POST /tasks – Create task

GET /tasks – Get all tasks

PUT /tasks/:id – Update task

DELETE /tasks/:id – Delete task
```

Project Link: https://task-manager-app-1-vasg.onrender.com
