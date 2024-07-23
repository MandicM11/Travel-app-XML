const express = require('express');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');

const app = express();
app.use(express.json());

// MongoDB konekcija
mongoose.connect('mongodb://mongo:27017/touristDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

app.use(blogRoutes);

const port = process.env.PORT || 8002;
app.listen(port, () => {
  console.log(`Blog service running on port ${port}`);
});
