import axios from "axios";
import { getToken } from "../utils/auth";
import { useState } from "react";
const TaskForm = ({ onTaskCreated, users }) => {
  const [assignedTo, setAssignedTo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = getToken();

    const newTask = {
      title: e.target.title.value,
      description: e.target.description.value,
      dueDate: e.target.dueDate.value,
      priority: e.target.priority.value,
      status: e.target.status.value,
      assignedTo: assignedTo,
    };

    axios
      .post("http://localhost:8080/tasks", newTask, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        onTaskCreated();
        e.target.reset();
        setAssignedTo("");
      })
      .catch((err) => console.error("Error Creating Task", err));
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" placeholder="Title" required />
      <input
        type="text"
        name="description"
        placeholder="Description"
        required
      />
      <input type="date" name="dueDate" required />
      <select name="priority">
        <option value="">Select Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select name="status">
        <option value="todo">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <label>Assign To:</label>
      <select
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
      >
        <option value="">Select User</option>
        {users.map((user) => {
          return (
            <option key={user._id} value={user._id}>
              {user.username}
            </option>
          );
        })}
      </select>
      <button type="submit">Create Task</button>
    </form>
  );
};

export default TaskForm;
