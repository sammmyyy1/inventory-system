const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Session middleware
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));
app.get('/', (req, res) => {
    res.send('Server is working!');
});

// Routes
//app.use('/', require('./routes/auth'));
//app.use('/inventory', require('./routes/inventory'));
app.get('/dashboard', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.render('dashboard');
});


const PORT = process.env.PORT || 3000;

// MongoDB connect and server start
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch(err => console.log(err));
