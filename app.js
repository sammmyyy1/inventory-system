const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create app
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Session setup
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}));

// Import routes
const authRoutes = require('./routes/auth');
const inventoryRoutes = require('./routes/inventory');

// Use routes
app.use('/', authRoutes);
app.use('/inventory', inventoryRoutes);

// Dashboard route (requires login)
app.get('/dashboard', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.render('dashboard');
});

// Optional: Home test route
app.get('/', (req, res) => {
    res.send('Simlin Inventory Server is running!');
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI, { })
    .then(() => {
        app.listen(PORT, () =>
            console.log(`✅ Server running at http://localhost:${PORT}`)
        );
    })
    .catch(err => console.error('❌ MongoDB connection error:', err));
