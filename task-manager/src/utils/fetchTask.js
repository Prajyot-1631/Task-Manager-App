import axios from "axios";
import { getToken } from "./auth";

const fetchTask = async (navigate) => {
  const token = getToken();
  try {
    const res = await axios.get(
      "https://task-manager-app-4ivg.onrender.com/tasks",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data.tasks;
  } catch (err) {
    console.error("Failed to load Tasks", err);
    if (navigate) navigate("/login");
    return [];
  }
};

export default fetchTask;
