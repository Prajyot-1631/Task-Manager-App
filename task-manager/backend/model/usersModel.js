const mongoose = require("mongoose");
const { userSchema } = require("../schema/usersSchema");

const User = mongoose.model("User", userSchema);

module.exports = { User };
