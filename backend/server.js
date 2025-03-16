// Used External modules --
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Used Local Modules --
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection --
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Error:", err));

// Test Route --
app.get("/", (req, res) => {
  res.send("Resume Maker Backend is Running...");
});

// User Routes --
app.use("/api/users", userRoutes);

// Server Listen --
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
