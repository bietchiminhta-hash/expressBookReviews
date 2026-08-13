const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Unable to register user. Username and password required."});
  }

  if (isValid(username)) {
    return res.status(404).json({message: "User already exists!"});
  }

  users.push({"username": username, "password": password});
  return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 4));
  } else {
    return res.status(404).json({message: "Book not found for the given ISBN"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const matchingBooks = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].author === author) {
      matchingBooks[isbn] = books[isbn];
    }
  });

  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } else {
    return res.status(404).json({message: "No books found for the given author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const matchingBooks = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].title === title) {
      matchingBooks[isbn] = books[isbn];
    }
  });

  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } else {
    return res.status(404).json({message: "No books found for the given title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({message: "Book not found for the given ISBN"});
  }
});

// Get all books – using async/await with Axios
async function getAllBooks() {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}

// Search by ISBN – using Promise with Axios
function getBookByISBN(isbn) {
  return axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.error(error.message);
    });
}

// Search by Author – using async/await with Axios
async function getBookByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}

// Search by Title – using Promise with Axios
function getBookByTitle(title) {
  return axios.get(`http://localhost:5000/title/${title}`)
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.error(error.message);
    });
}

module.exports.general = public_users;
