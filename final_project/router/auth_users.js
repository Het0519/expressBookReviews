const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username, password)=>{ //returns boolean
    if (username) {
        const user = users.filter((user => user.username === username));
        if (user.length === 0) {
            users.push({
                "username": username,
                "password": password
            })
            return true
        } else {
            return false;
        }
    } else {
        return false
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
        const user = users.filter((user) => user.username === username && user.password === password);
        if (user.length > 0) {
            return true;
        } else {
            return false;
        }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username =  req.body.username;
    const password = req.body.password; 
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password,
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username,
        }
        return res.status(200).send(`User ${username} successfully logged in.`);
    } else {
        return res.status(208).json({ message: "Check username and password. Not valid login details." });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const bookForReview = books[isbn];
    const review = req.body.review;
   
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];
        // Verify token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                bookForReview[review] = {
                    user : review,
                }
                books[isbn] = bookForReview;
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
