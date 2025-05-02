const express = require("express");
const mongoose = require("mongoose");

const app = express();

const PORT = 8080;

mongoose
  .connect("mongodb://localhost:27017/taskmanager")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error", err));

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
