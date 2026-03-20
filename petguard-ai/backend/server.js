const express = require('express');
const cors = require('cors');
require('dotenv').config();

const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/ai', aiRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'PetGuard AI Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
