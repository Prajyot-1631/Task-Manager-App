const Task = require("../model/taskModel");
const Notification = require("../model/notificationModel");

// Create new Task
const createTaskRoute = async (req, res) => {
  const { title, description, dueDate, priority, status, assignedTo } =
    req.body;

  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      assignedTo,
      createdBy: req.user.userId,
    });

    await newTask.save();
    if (assignedTo && assignedTo !== req.user.userId) {
      await Notification.create({
        recipient: assignedTo,
        message: `You have been assigned a new task: ${title}`,
      });
    }
    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Error creating Task", error });
  }
};

module.exports = createTaskRoute;
