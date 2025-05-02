// Read all Tasks
const Task = require("../model/taskModel");

const readAllTaskRoute = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Error retreiving tasks", error });
  }
};

const readTaskByIdRoute = async (req, res) => {
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
};

module.exports = readAllTaskRoute;
module.exports = readTaskByIdRoute;
