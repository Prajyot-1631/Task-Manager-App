const express = require("express");
const mongoose = require("mongoose");
const signup = require("./Auth/Signup");
const loginHandler = require("./Auth/Login");
const authenticateToken = require("./middleware/authMiddleware");
const Task = require("./model/taskModel");

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
// Create new Task
app.post("/tasks", async (req, res) => {
  const { title, description, dueDate, priority, status } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
    });

    await newTask.save();
    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Error creating Task", error });
  }
});

// Read all Tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Error retreiving tasks", error });
  }
});

// Get a single task by ID
app.get("/tasks/:id", async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ message: "Error retreiving task", error });
  }
});

// Update a Task by ID
app.put("/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  const { title, description, dueDate, status, priority } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, description, dueDate, status, priority },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Error pdating task", error });
  }
});

// Delete a task by ID
app.delete("/tasks/:id", async (req, res) => {
  const taskId = req.params.id;

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (errro) {
    res.status(500).json({ message: "Error deleting Task", error });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
