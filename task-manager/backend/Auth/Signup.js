const bcrypt = require("bcrypt");
const user = require("../model/usersModel");

//POST Route to register a new user
const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User Already Exists" });
  }
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
    res.status(201).json({ message: "User registerd successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

module.exports = signup;
