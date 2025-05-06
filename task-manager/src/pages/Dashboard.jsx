import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import TaskForm from "../components/TaskForm";
import TaskEditForm from "../components/TaskEditForm";
import TaskList from "../components/TaskList";
import { getToken } from "../utils/auth";

const fetchTask = async (setTasks, navigate) => {
  const token = getToken();
  try {
    const res = await axios.get("http://localhost:8080/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(res.data.tasks);
  } catch (err) {
    console.error("Failed to load Tasks", err);
    if (navigate) navigate("/login");
  }
};

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    dueDate: "",
  });
  const [user, setUser] = useState(null);
  //null :- because user is not loaded yet and user is an object
  const [tasks, setTasks] = useState([]);
  const [editForm, setEditForm] = useState({
    _id: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "",
    status: "todo",
  });
  //   To toggle form visibility
  const [showEditForm, setShowEditForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();

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
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        console.error("Unauthorized", err);
        localStorage.removeItem("token");
        navigate("/login");
      });
    fetchTask(setTasks, navigate);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDelete = (taskId) => {
    const token = getToken();
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
    setEditForm(task);
    setShowEditForm(true);
  };

  //task filter logic for Search
  const filteredTask = tasks.filter((task) => {
    //Search Logic
    const matchesSearchTerm =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());

    //   Filter Logic
    const matchesFilter =
      (!filters.status || task.status === filters.status) &&
      (!filters.priority || task.priority === filters.priority) &&
      (!filters.dueDate || task.dueDate === filters.dueDate);

    //   Return Task if it matches both Search and Filters
    return matchesSearchTerm && matchesFilter;
  });

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
      <TaskForm onTaskCreated={() => fetchTask(setTasks, navigate)} />

      <h2>Search Task</h2>
      <input
        type="text"
        placeholder="Search Task..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <h2>Filter Task By:</h2>
      <div>
        <select
          value={filters.status}
          onChange={(e) =>
            setFilters({
              ...filters,
              status: e.target.value,
            })
          }
        >
          <option value="">All Statuses</option>
          <option value="todo">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="date"
          value={filters.dueDate}
          onChange={(e) => setFilters({ ...filters, dueDate: e.target.value })}
        />
      </div>

      <h2>Your Tasks:</h2>
      {tasks.length === 0 ? (
        <p>No Task Found</p>
      ) : (
        <TaskList
          tasks={filteredTask}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      )}
      {showEditForm && (
        <TaskEditForm
          editForm={editForm}
          setEditForm={setEditForm}
          onUpdated={() => fetchTask(setTasks, navigate)}
          onClose={() => setShowEditForm(false)}
        />
      )}
    </div>
  );
};
export default Dashboard;
