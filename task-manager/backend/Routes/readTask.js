// Read all Tasks
const Task = require("../model/taskModel");

const readAllTaskRoute = async (req, res) => {
  //   console.log("User making the request:", req.user.userId);
  try {
    const tasks = await Task.find({
      $or: [{ createdBy: req.user.userId }, { assignedTo: req.user.userId }],
    })
      .populate("assignedTo", "username email")
      .populate("createdBy", "username email");
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Error retreiving tasks", error });
  }
};

const readTaskByIdRoute = async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findOne({
      _id: taskId,
      createdBy: req.user.userId,
    })
      .populate("assignedTo", "username email")
      .populate("createdBy", "username email");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ message: "Error retreiving task", error });
  }
};

module.exports = {
  readAllTaskRoute,
  readTaskByIdRoute,
};
