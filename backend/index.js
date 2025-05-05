const express = require('express');
const app = express();
const cors = require('cors');
const notes = require('./routes/notes');

app.use(cors());
app.use(express.json());

app.use('/api/notes', notes);

const port = 3000;
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
