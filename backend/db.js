const Database = require('better-sqlite3');
const db = new Database('data.sqlite');

// Tạo bảng nếu chưa có
db.prepare(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER DEFAULT 0
  )
`).run();

module.exports = db;
