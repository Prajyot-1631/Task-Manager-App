import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null); //null :- because user is not loaded yet and user is an object
  const [tasks, setTasks] = useState([]);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default Dashboard;
