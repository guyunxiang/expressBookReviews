const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// returns boolean
const isValid = (username) => {
  const isValidUser = !users.some((user) => user.username === username);
  return isValidUser;
};

// returns boolean
// write code to check if username and password match the one we have in records.
const authenticatedUser = (username, password) => {
  const isValidUser = users.some(
    (user) => user.username === username && user.password === password
  );
  return isValidUser;
};

// Task 7
// only registered users can login
regd_users.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;
    // Check if username or password is missing
    if (!username || !password) {
      return res.status(401).json({
        message: "Error logging in",
      });
    }
    // Authenticate user
    if (!authenticatedUser(username, password)) {
      return res.status(401).json({
        message: "Invalid username or password.",
      });
    }
    // Generate JWT access token
    const accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );
    // Store access token and username in session
    req.session.authorization = {
      accessToken,
      username,
    };
    res.status(200).send("User successfully logged in");
  } catch (error) {
    res.status(500).json({ message: "Network Error!" });
  }
});

// Task 8
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  try {
    const { isbn } = req.params;
    const { review } = req.body;
    const { username } = req.session.authorization;
    if (!username) {
      return res.status(401).json({
        message: "Unauthorized!",
      });
    }
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({
        message: "Book not found!",
      });
    }
    book.reviews[username] = review;
    res.status(201).json({
      message: "Review posted successfully!",
    });
  } catch (error) {
    return res.status(500).json({ message: "Network Error!" });
  }
});

// Task 9
regd_users.delete("/auth/review/:isbn", (req, res) => {
  try {
    const { isbn } = req.params;
    const { username } = req.session.authorization;
    if (!username) {
      return res.status(401).json({
        message: "Unauthorized!",
      });
    }
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({
        message: "Book not found!",
      });
    }
    if (!book.reviews[username]) {
      return res.status(404).json({
        message: "Review not found!",
      });
    }
    delete books[isbn].reviews[username];
    res.status(201).json({
      message: "Review deleted successfully!",
    });
  } catch (error) {
    return res.status(500).json({ message: "Network Error!" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
