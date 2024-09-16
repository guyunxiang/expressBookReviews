const express = require("express");
const axios = require("axios");

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const api = axios.create({
  baseURL: "http://localhost:5000",
});

// Task 6
public_users.post("/register", (req, res) => {
  try {
    const { username, password } = req.body;
    // validate required fields
    if (!username || !password) {
      return res.status(400).json({
        message: "Required fields are missing.",
      });
    }
    // validate username
    if (!isValid(username)) {
      return res.status(409).json({
        message: "Username already exists.",
      });
    }
    // register user
    users.push({ username, password });
    res.status(201).json({ message: "Registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Network Error!" });
  }
});

// Task 1
// Get the book list available in the shop
public_users.get("/", function (req, res) {
  try {
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Network Error!" });
  }
});

// Task 10
public_users.get("/books/query", async (req, res) => {
  try {
    const response = await api.get("/");
    return res.status(200).json({
      books: response.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Network Error!" });
  }
});

// Task 2
// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  try {
    const { isbn } = req.params;
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({
        message: "Book not found!",
      });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Network Error!" });
  }
});

// Task 11
public_users.get("/books/:isbn", async (req, res) => {
  try {
    const { isbn } = req.params;
    const response = await api.get("/isbn/" + isbn);
    return res.status(200).json({
      book: response.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Network Error!" });
  }
});

// Task 3
// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  try {
    const { author } = req.params;
    const authorBooks = Object.values(books).filter(
      (book) => book.author === author
    );
    if (authorBooks.length > 0) {
      res.status(200).json(authorBooks);
    } else {
      res.status(404).json({ message: "books not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Network Error!" });
  }
});

// Task 12
public_users.get("/books/author/:author", async (req, res) => {
  try {
    const { author } = req.params;
    const response = await api.get("/author/" + author);
    return res.status(200).json({
      books: response.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Network Error!" });
  }
});

// Task 4
// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  try {
    const { title } = req.params;
    const titleBooks = Object.values(books).filter(
      (book) => book.title.toLocaleLowerCase() === title.toLocaleLowerCase()
    );
    if (titleBooks.length === 0) {
      return res.status(404).json({ message: "books not found" });
    }
    res.status(200).json(titleBooks);
  } catch (error) {
    res.status(500).json({ message: "Network Error!" });
  }
});

// Task 13
public_users.get("/books/title/:title", async (req, res) => {
  try {
    const { title } = req.params;
    const response = await api.get("/title/" + title);
    return res.status(200).json({
      books: response.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Network Error!" });
  }
});

// Task 5
// Get book review
public_users.get("/review/:isbn", function (req, res) {
  try {
    const { isbn } = req.params;
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({
        message: "Book not found!",
      });
    }
    res.status(200).json(book.reviews);
  } catch (error) {
    res.status(500).json({ message: "Network Error!" });
  }
});

module.exports.general = public_users;
