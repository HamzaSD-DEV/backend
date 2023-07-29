const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const imageRoutes = require('./routes/imageRoutes');
const cors=require('cors')
const bodyParser = require("body-parser");
const db = require('./config/db');

// const { verifyToken } = require('./middleware/auth');

// Middleware
app.use(express.json());
app.use(cors({origin: "*"}))
app.use(bodyParser.json())


// Routes
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', imageRoutes);
module.exports = app;
