const Task = require("../model/taskModel");

// Update a Task by ID

const updateTaskRoute = async (req, res) => {
  const taskId = req.params.id;
  const { title, description, dueDate, status, priority, assignedTo } =
    req.body;

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, createdBy: req.user.userId },
      { title, description, dueDate, status, priority, assignedTo },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
};

module.exports = updateTaskRoute;
