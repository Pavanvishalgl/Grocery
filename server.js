const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'grocery-secret',
    resave: false,
    saveUninitialized: true
}));

// Dummy user (you can replace this with DB later)
const USER = {
    username: "admin",
    password: "1234"
};

// Login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Handle login
app.post('/login', (req, res) => {
    console.log("Logged in!")
    const { username, password } = req.body;

    if (username === USER.username && password === USER.password) {
        req.session.user = username;
        res.redirect('/billing'); // ✅ should go to /billing
    } else {
        res.send('Invalid credentials. <a href="/">Try again</a>');
    }
});

// Billing page (protected)
app.get('/billing', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        res.redirect('/');
    }
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});