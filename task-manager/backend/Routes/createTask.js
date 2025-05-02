const Task = require("../model/taskModel");

// Create new Task
const createTaskRoute = async (req, res) => {
  const { title, description, dueDate, priority, status } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      createdBy: req.user.userId,
    });

    await newTask.save();
    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Error creating Task", error });
  }
};

module.exports = createTaskRoute;
