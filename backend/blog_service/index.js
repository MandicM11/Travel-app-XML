const express = require('express');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const commentRoutes = require('./routes/comments');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

mongoose.connect('mongodb://mongo:27017/touristDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

app.use(authMiddleware, blogRoutes);
app.use(commentRoutes);

const port = process.env.PORT || 8002;
app.listen(port, () => {
  console.log(`Blog service running on port ${port}`);
});
