
import express from "express";
import Task from "../models/Task.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All task routes require login
router.use(protect);

// Get logged-in user's tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({
      createdAt: -1
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add task
router.post("/", async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      subject: req.body.subject,
      priority: req.body.priority,
      done: false,
      user: req.user._id
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update task
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        title: req.body.title,
        subject: req.body.subject,
        priority: req.body.priority,
        done: req.body.done
      },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
