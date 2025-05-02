const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./model/usersModel");

const app = express();
const PORT = 8080;

// Middleware to parse JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/taskmanager")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error", err));

//POST ROute to register a new user
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User ALready Exists" });
  }
});

// Hashing the password
const hashedPassword = await bcrypt.hash(password, 10);

//Creating new user and saving to db
const newUser = new User({
  username,
  email,
  password: hashedPassword,
});

try {
  await newUser.save();
  res.status(201).json({ mssage: "USer registerd successfully" });
} catch (error) {
  res.status(500).json({ message: "Error registering user", error });
}

// Start the Server
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
