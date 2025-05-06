const express = require('express');
const router = express.Router();
const db = require('../db');

// Lấy tất cả notes
router.get('/', (req, res) => {
  const notes = db.prepare('SELECT * FROM notes ORDER BY pinned DESC, updated_at DESC').all();
  res.json(notes);
});

// Tạo mới note
router.post('/', (req, res) => {
  const { title, content, color } = req.body;
  if (!title && !content) {
    return res.status(400).json({ error: 'Ghi chú trống!' })
  }
  
  const stmt = db.prepare(`
    INSERT INTO notes (title, content, color)
    VALUES (?, ?, ?)
  `);
  const result = stmt.run(title, content, color || '#ffffff');
  const newNote = db.prepare('SELECT * FROM notes WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newNote);
});

// Cập nhật note
router.put('/:id', (req, res) => {
  const { title, content, color, pinned } = req.body;
  const id = req.params.id;
  if (!title && !content) {
    return res.status(400).json({ error: 'Ghi chú trống!' })
  }
  
  db.prepare(`
    UPDATE notes
    SET title = ?, content = ?, color = ?, pinned = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(title, content, color, pinned ? 1 : 0, id);

  const updatedNote = db.prepare('SELECT * FROM notes WHERE id = ?').get(id);
  res.json(updatedNote);
});

// Xoá note
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.prepare('DELETE FROM notes WHERE id = ?').run(id);
  res.json({ message: 'Deleted', id });
});

module.exports = router;
