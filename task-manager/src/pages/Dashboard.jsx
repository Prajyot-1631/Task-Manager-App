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

      <h2>Your Tasks:</h2>
      {tasks.length === 0 ? (
        <p>No Task Found</p>
      ) : (
        <TaskList
          tasks={tasks}
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
