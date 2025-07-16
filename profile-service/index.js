require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Profile-Service: MongoDB Connected'))
    .catch(err => console.error('Profile-Service: MongoDB Connection Error:', err));

// Routes
app.use('/api/profile', require('./routes/profile'));
app.use('/api/books', require('./routes/books'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Profile-Service running on port ${PORT}`));