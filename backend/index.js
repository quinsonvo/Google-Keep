const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample route
const tasks = require('./routes/tasks');
app.use('/api/tasks', tasks);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
