import axios from "axios";
import { getToken } from "../utils/auth";

const TaskEditForm = ({ editForm, setEditForm, onUpdated, onClose, users }) => {
  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = getToken();

    try {
      await axios.put(
        `http://localhost:8080/tasks/${editForm._id}`,
        {
          title: editForm.title,
          description: editForm.description,
          dueDate: editForm.dueDate,
          priority: editForm.priority,
          status: editForm.status,
          assignedTo: editForm.assignedTo,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onUpdated();
      onClose();
    } catch (error) {
      console.error("Update failed", error);
    }
  };
  return (
    <form onSubmit={handleUpdate}>
      <input
        type="text"
        placeholder="Title"
        value={editForm.title}
        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
        required
      />
      <textarea
        placeholder="Description"
        value={editForm.description}
        onChange={(e) =>
          setEditForm({ ...editForm, description: e.target.value })
        }
        required
      ></textarea>

      <input
        type="date"
        value={editForm.dueDate}
        onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
        required
      />

      <select
        value={editForm.priority}
        onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
        required
      >
        <option value="">Select Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <select
        value={editForm.status}
        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
        required
      >
        <option value="todo">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <label>Assign To:</label>
      <select
        value={editForm.assignedTo || ""}
        onChange={(e) =>
          setEditForm({ ...editForm, assignedTo: e.target.value })
        }
        required
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
      <button type="submit">Update Task</button>
    </form>
  );
};

export default TaskEditForm;
