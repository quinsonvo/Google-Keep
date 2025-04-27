const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all tasks
router.get("/", (req, res) => {
  const tasks = db.prepare("SELECT * FROM tasks").all();
  res.json(tasks);
});

// POST new task
router.post("/", (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  const stmt = db.prepare("INSERT INTO tasks (title) VALUES (?)");
  const result = stmt.run(title);

  const newTask = db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(result.lastInsertRowid);
  res.status(201).json(newTask);
});

// PATCH toggle done
router.patch("/:id", (req, res) => {
  const id = req.params.id;
  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);

  if (!task) return res.status(404).json({ message: "Task not found" });

  const newStatus = task.done ? 0 : 1;
  db.prepare("UPDATE tasks SET done = ? WHERE id = ?").run(newStatus, id);

  const updated = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
  res.json(updated);
});

// DELETE task
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  res.json({ message: 'Task deleted', id });
});

module.exports = router;
