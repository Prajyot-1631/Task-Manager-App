const { schema } = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

module.exports = { userSchema };
