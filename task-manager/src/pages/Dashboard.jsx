import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null); //null :- because user is not loaded yet and user is an object
  const [tasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState("null");
  const [editForm, setEditForm] = useState({
    _id: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "",
    status: "todo",
  });
  //   TO toggle form visibility
  const [showEditForm, setShowEditForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Redirect to /login if no token
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:8080/dashboard", {
        headers: {
          //Attaches an Authorization header with JWT Token
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUser(res.data.user))
      .catch((err) => {
        console.error("Unauthorized", err);
        localStorage.removeItem("token");
        navigate("/login");

        // Fetch tasks
        axios
          .get("http://localhost:8080/tasks", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => setTasks(res.data.tasks))
          .catch((err) => {
            console.error("Failed to Load Tasks", err);
          });
      });
  }, [navigate]);

  //   Fetch Task Function
  const fetchTask = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8080/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTasks(res.data.tasks))
      .catch((err) => {
        console.error("Failed to load tasks", err);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDelete = (taskId) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:8080/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // Filter out deleted task
        setTasks((prevTask) => prevTask.filter((t) => t._id !== taskId));
      })
      .catch((err) => {
        console.error("Error Deleting Task", err);
      });
  };

  const handleEditClick = (task) => {
    setEditForm({
      _id: task._id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
    });
    setShowEditForm(true);
  };

  //   Handle Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:8080/tasks/${editForm._id}`,
        {
          title: editForm.title,
          description: editForm.description,
          dueDate: editForm.dueDate,
          priority: editForm.priority,
          status: editForm.status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTask();
      setEditForm({
        _id: "",
        title: "",
        description: "",
        dueDate: "",
        priority: "",
        status: "todo",
      });
      setShowEditForm(true);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <>
          <p>Welcome, {user.username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Loading user info ...</p>
      )}

      <h3>Create New Task</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const token = localStorage.getItem("token");
          axios
            .post(
              "http://localhost:8080/tasks",
              {
                title: e.target.title.value,
                description: e.target.description.value,
                dueDate: e.target.dueDate.value,
                priority: e.target.priority.value,
                status: e.target.status.value,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            )
            .then(() => {
              // Refetch tasks after creating a new one
              return axios
                .get("http://localhost:8080/tasks", {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
                .then((res) => setTasks(res.data.tasks))
                .catch((err) => {
                  console.error("Error creating task", err);
                });
            });
        }}
      >
        <input type="text" name="title" placeholder="Title" required />
        <input
          type="text"
          name="description"
          placeholder="Description"
          required
        />
        <input type="date" name="dueDate" required />
        <select name="priority">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select name="status">
          <option value="todo">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button type="submit">Create Task</button>
      </form>

      <h2>Your Tasks:</h2>
      {tasks.length === 0 ? (
        <p>No Task Found</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task._id}>
              <strong>
                {task.title} - {task.status} - {task.priority}
              </strong>
              <button onClick={() => handleEditClick(task)}>Edit</button>
              <button onClick={() => handleDelete(task._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      {showEditForm && (
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            placeholder="Title"
            value={editForm.title}
            onChange={(e) =>
              setEditForm({ ...editForm, title: e.target.value })
            }
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
            value={editForm.dueDate.split("T")[0]}
            onChange={(e) =>
              setEditForm({ ...editForm, dueDate: e.target.value })
            }
            required
          />

          <select
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

          <select
            value={editForm.status}
            onChange={(e) =>
              setEditForm({ ...editForm, status: e.target.value })
            }
            required
          >
            <option value="todo"></option>
            <option value="in-progress"></option>
            <option value="Done"></option>
          </select>
          <button type="submit">Update Task</button>
        </form>
      )}
    </div>
  );
};
export default Dashboard;
