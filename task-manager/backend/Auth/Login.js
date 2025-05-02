const bcrypt = require("bcrypt");
const user = require("../model/usersModel");

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    console.log("Login Successful!");
    res.status(200).json({ message: "Login Successful!" });
  } else {
    res.status(401).json({ message: "Unauthorized Access!" });
  }
};

module.exports = login;
