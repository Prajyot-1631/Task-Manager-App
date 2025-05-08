import axios from "axios";
import { getToken } from "./auth";

const FetchAllUsers = async () => {
  const token = getToken();
  try {
    const res = await axios.get(
      "https://task-manager-app-4ivg.onrender.com/users",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data.users;
  } catch (err) {
    console.error("Error fetching users", err);
    return [];
  }
};

export default FetchAllUsers;
