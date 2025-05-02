const Task = require("../model/taskModel");

// Delete a task by ID
const deleteTaskRoute = async (req, res) => {
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
};

module.exports = deleteTaskRoute;
