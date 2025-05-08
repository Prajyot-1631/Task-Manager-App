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
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          className="form-control"
          type="text"
          placeholder="Title"
          value={editForm.title}
          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          value={editForm.description}
          onChange={(e) =>
            setEditForm({ ...editForm, description: e.target.value })
          }
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Due Date</label>
        <input
          type="date"
          className="form-control"
          value={editForm.dueDate}
          onChange={(e) =>
            setEditForm({ ...editForm, dueDate: e.target.value })
          }
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Priority</label>
        <select
          className="form-select"
          value={editForm.priority}
          onChange={(e) =>
            setEditForm({ ...editForm, priority: e.target.value })
          }
          required
        >
          <option value="">Select Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Status</label>
        <select
          className="form-select"
          value={editForm.status}
          onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
          required
        >
          <option value="todo">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Assign To</label>
        <select
          className="form-select"
          value={editForm.assignedTo || ""}
          onChange={(e) =>
            setEditForm({ ...editForm, assignedTo: e.target.value })
          }
          required
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>

      <div className="d-flex justify-content-between">
        <button type="submit" className="btn btn-success">
          Update Task
        </button>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskEditForm;
