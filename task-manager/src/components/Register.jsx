import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/register", {
        //later change this with actual register url
        username,
        email,
        password,
      });
      console.log("Server response:", res.data);
      alert("User Registered Successfully");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed!");
      console.error("Registration Failed", error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        ></input>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        ></input>
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        ></input>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
