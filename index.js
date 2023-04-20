// Make a server with the auth service in cookies
// in express
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const User = require('./models/user');

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());

mongoose.connect(process.env.DB , {useNewUrlParser: true, useUnifiedTopology: true})

app.post('/login', (req, res) => {
    // Get the user from the database
    // and then set the cookie
    const {user} = req.body;
    User.findOne({phone: user}, (err, user) => {
        if (err) {
            res.status(500).send('Error finding user');
        } else if (!user) {
            res.status(404).send('User not found');
        } else {
            res.cookie('user', user.phone, {maxAge: 900000, httpOnly: true, signed: true});
            res.status(200).send();
        }
    });
});

app.post('/register', (req, res) => {
    // Create a new user and then set the cookie
    const {user} = req.body;
    const newUser = new User({
        phone: user
    });
    newUser.save((err, user) => {
        if (err) {
            res.status(500).send('Error saving user');
        } else {
            // use a signed cookie
            res.cookie('user', user.phone, {maxAge: 900000, httpOnly: true, signed: true});

            res.status(200).send();
        }
    });
});

app.post('/verify', (req, res) => {
    // Verify the user
    const {user} = req.body;
    // get the signed cookie and check if it is tampered
    // const signedCookie = req.signedCookies.user;
    User.findOne({phone: user}, (err, user) => {
        if (err) {
            res.status(500).send('Error finding user');
        } else if (!user) {
            res.status(404).send('User not found');
        } else {
            res.status(200).send();
        }
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
});