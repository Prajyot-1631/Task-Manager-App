const express = require("express");
const mongoose = require("mongoose");

const signup = require("./Auth/Signup");
const loginHandler = require("./Auth/Login");
const createTaskRoute = require("./Routes/createTask");
const readAllTaskRoute = require("./Routes/readTask");
const readTaskByIdRoute = require("./Routes/readTask");
const updateTaskRoute = require("./Routes/updateTask");
const deleteTaskRoute = require("./Routes/deleteTask");

const authenticateToken = require("./middleware/authMiddleware");

const app = express();
const PORT = 8080;

// Middleware to parse JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/taskmanager")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error", err));

//   Routes
app.post("/register", signup);
app.post("/login", loginHandler);

// Example of a protected Route
app.get("/dashboard", authenticateToken, (req, res) => {
  res.json({
    message: "Welcome to your dashboard!",
    user: req.user,
  });
});

// CRUD
// C
app.post("/tasks", createTaskRoute);

// R
app.get("/tasks", readAllTaskRoute);
// Get a single task by ID
app.get("tasks/:id", readTaskByIdRoute);

// U
app.put("tasks/:id", updateTaskRoute);

// D
app.delete("/tasks/:id", deleteTaskRoute);

// Start the Server
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
