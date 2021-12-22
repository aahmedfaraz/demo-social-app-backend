const express = require('express');
const connectDB = require('./config/db');

connectDB();

const app = express();

// Init Middleware
app.use(express.json({ extended: false }));

// @route GET /api
// @desc Get the initial response from the Server
// @access Public
app.get('/', (req, res) => {
    res.status(200).json({
        name: 'Ahmed Faraz',
        skills: 'Cloud Architect',
    });
});

// OTHER ROUTES

// user routes
app.use('/api/user', require('./routes/user'));
// posts routes
app.use('/api/posts', require('./routes/posts'));
// auth routes
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`The Server has been started on port : ${PORT} \nhttp://localhost:${PORT}`))

