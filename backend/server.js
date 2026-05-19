const express = require('express');
const cors = require('cors');
require('dotenv').config();

const contactRoutes = require('./routes/contact');
const chatRoutes    = require('./routes/chat');
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/chat', chatRoutes);


// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Dexvira Solutions API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
