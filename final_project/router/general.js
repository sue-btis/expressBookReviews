const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    if (users.find((user) => user.username === username)) {
      return res.status(409).json({ message: "Username already exists" });
    }
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 2))
});


const getByISBN = (isbn) => {
    let isbnNum = parseInt(isbn);
    if (books[isbnNum]) {
        return books[isbnNum]; 
    } else {
        return null; 
    }
}
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const book = getByISBN(req.params.isbn); 

    if (book) {
        res.json(book); 
    } else {
        res.status(404).json({ message: `ISBN ${req.params.isbn} not found` });
    }
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;  
    const booksByAuthor = [];

    Object.keys(books).forEach(key => {
        if (books[key].author && books[key].author.toLowerCase() === author.toLowerCase()) {
            booksByAuthor.push(books[key]);
        }
    });

    if (booksByAuthor.length > 0) {
        res.json(booksByAuthor); 
    } else {
        res.status(404).json({ message: `No books found by author: ${author}` }); 
    }
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    const booksByTitle = [];

    Object.keys(books).forEach(key => {
        if (books[key].title && books[key].title.toLowerCase() === title) {
            booksByTitle.push(books[key]);
        }
    });

    if (booksByTitle.length > 0) {
        res.json(booksByTitle);
    } else {
        res.status(404).json({ message: `No books found with title: ${title}` });
    }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
