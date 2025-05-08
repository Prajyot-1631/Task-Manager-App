require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const signup = require("./Auth/Signup");
const loginHandler = require("./Auth/Login");
const createTaskRoute = require("./Routes/createTask");
const { readAllTaskRoute, readTaskByIdRoute } = require("./Routes/readTask");
const updateTaskRoute = require("./Routes/updateTask");
const deleteTaskRoute = require("./Routes/deleteTask");
const fetchUsers = require("./Routes/fetchAllUsers");
const getNotifications = require("./Routes/getNotifications");

const authenticateToken = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors());

// Middleware to parse JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected To MongDB Server"))
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
app.post("/tasks", authenticateToken, createTaskRoute);

// R
app.get("/tasks", authenticateToken, readAllTaskRoute);
// Get a single task by ID
app.get("/tasks/:id", authenticateToken, readTaskByIdRoute);

// U
app.put("/tasks/:id", authenticateToken, updateTaskRoute);

// D
app.delete("/tasks/:id", authenticateToken, deleteTaskRoute);

// Get Notifications Route
app.get("/notifications", authenticateToken, getNotifications);

// Fetch All Users
app.get("/users", fetchUsers);

// Start the Server
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
