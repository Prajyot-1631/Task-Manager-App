import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import TaskForm from "../components/TaskForm";
import TaskEditForm from "../components/TaskEditForm";
import TaskList from "../components/TaskList";
import { getToken } from "../utils/auth";

import FetchAllUsers from "../utils/FetchAllUsers";
import fetchTask from "../utils/fetchTask";

const Dashboard = () => {
  const [notifications, setNotifications] = useState([]);
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
  //   To Fetch Users
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();

    // Redirect to /login if no token
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("https://task-manager-app-4ivg.onrender.com/dashboard", {
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
    fetchTask(navigate).then(setTasks);
    fetchNotifications();
  }, [navigate]);

  const fetchNotifications = async () => {
    const token = getToken();
    try {
      const response = await axios.get(
        "https://task-manager-app-4ivg.onrender.com/notifications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  useEffect(() => {
    //for fetching users
    const loadUsers = async () => {
      const fetchedUsers = await FetchAllUsers();
      setUsers(fetchedUsers);
    };
    loadUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDelete = (taskId) => {
    const token = getToken();
    axios
      .delete(`https://task-manager-app-4ivg.onrender.com/tasks/${taskId}`, {
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
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Dashboard</h1>
        {user ? (
          <>
            <span className="me-3">Welcome, {user.username}!</span>
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <p>Loading user info ...</p>
        )}
      </div>

      {/* To Load Notifications */}
      <div className="card p-4 mb-4">
        <h2>Notifications:</h2>
        {notifications.length === 0 ? (
          <p>No notifications.</p>
        ) : (
          <ul className="list-group">
            {notifications.map((n) => (
              <li key={n._id} className="list-group-item">
                {n.message}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card p-4 mb-4">
        <h3>Create New Task</h3>
        <TaskForm
          onTaskCreated={() => fetchTask(navigate).then(setTasks)}
          users={users}
        />
      </div>

      <div className="card p-4 mb-4">
        <h2>Search Task</h2>
        <input
          className="form-control mb-3"
          type="text"
          placeholder="Search Task..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <h2>Filter Task By:</h2>
      <div className="row g-3">
        <div className="col-md-4"></div>
        <select
          className="form-select"
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

        <div className="col-md-4">
          <select
            className="form-select"
            value={filters.priority}
            onChange={(e) =>
              setFilters({ ...filters, priority: e.target.value })
            }
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="col-md-4">
          <input
            className="form-control"
            type="date"
            value={filters.dueDate}
            onChange={(e) =>
              setFilters({ ...filters, dueDate: e.target.value })
            }
          />
        </div>
      </div>

      <div className="card p-4 mb-4">
        <h2>Your Tasks:</h2>
        {tasks.length === 0 ? (
          <p>No Task Found</p>
        ) : (
          <TaskList
            tasks={filteredTask}
            onEdit={handleEditClick}
            onDelete={handleDelete}
            currentUserId={user._id}
          />
        )}
      </div>

      {showEditForm && (
        <div className="card p-4 mb-4">
          <TaskEditForm
            editForm={editForm}
            setEditForm={setEditForm}
            onUpdated={() => fetchTask(navigate).then(setTasks)}
            onClose={() => setShowEditForm(false)}
            users={users}
          />
        </div>
      )}
      {/* <div>                        //show all users
        <h2>All Users:</h2>
        <ul>
          {users.map((u) => {
            return <li key={u._id}>{u.username}</li>;
          })}
        </ul>
      </div> */}
    </div>
  );
};
export default Dashboard;
