const User = require("../model/usersModel");

const fetchUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: "Failed to load users", err });
  }
};

module.exports = fetchUsers;
