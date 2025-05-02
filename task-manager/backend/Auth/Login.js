const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../model/usersModel");

// JWT-- later move to .env
const JWT_SECRET = "supersecretkey";

const loginHandler = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid Credentials!" });
  }

  //   Creating JWT Token
  const token = jwt.sign(
    { userId: user._id, username: user.username },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({ message: "Login Successful", token });
};

module.exports = loginHandler;
