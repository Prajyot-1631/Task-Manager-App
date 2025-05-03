import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null); //null :- because user is not loaded yet and user is an object
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
    </div>
  );
};

export default Dashboard;
