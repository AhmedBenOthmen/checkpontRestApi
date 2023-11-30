require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User.js");

const { PORT, MONGODB_URI } = process.env;

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");

    // GET: Return all users
    app.get("/users", async (req, res) => {
      try {
        const users = await User.find();
        res.json(users);
      } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // POST: Add a new user to the database
    app.post("/users", async (req, res) => {
      const { username, email, password } = req.body;
      try {
        const newUser = new User({ username, email, password });
        const savedUser = await newUser.save();
        res.json(savedUser);
      } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // PUT: Edit a user by ID
    app.put("/users/:id", async (req, res) => {
      const userId = req.params.id;
      const { username, email, password } = req.body;
      try {
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { username, email, password },
          { new: true }
        );
        res.json(updatedUser);
      } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // DELETE: Remove a user by ID
    app.delete("/users/:id", async (req, res) => {
      const userId = req.params.id;
      try {
        const deletedUser = await User.findByIdAndRemove(userId);
        res.json(deletedUser);
      } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
