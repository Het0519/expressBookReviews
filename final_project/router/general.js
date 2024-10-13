
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (isValid(username, password)) {
    res.send(`User ${username} is registered!`)
  } else {
    res.send(`User ${userName} already exists..`)
  }

});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//     const bookList = JSON.stringify(books, null, 4);
//   return res.send(bookList);
// });

// Promises
// Function to retrieve book list as a promise
const getBookList = () => {
    return new Promise((resolve, reject) => {
        try {
        const bookList = JSON.stringify(books, null, 4);
        resolve(bookList);
        } catch (err) {
        reject(err);
        }
    });
};
  
// Use of above Promise
public_users.get('/', async (req, res) => {
    try {
      const bookList = await getBookList();
      res.send(bookList);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching book list');
    }
  });

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   const isbn_number = req.params.isbn;
//   const requestedBook = books[isbn_number];
//   if (requestedBook) {
//     return res.send(requestedBook);
//   } else {
//     return res.status(404).json({message: "Book not found with the given ISBN!"});
//   }
//  });
const getBookByIsbn = (isbn) => {
    return new Promise((resolve, reject) => {
      try {
        const requestedBook = books[isbn];
        if (requestedBook) {
          resolve(requestedBook);
        } else {
          reject({ status: 404, message: "Book not found with the given ISBN!" });
        }
      } catch (err) {
        reject(err);
      }
    });
  };
  
  // Get book details based on ISBN
  public_users.get('/isbn/:isbn', async (req, res) => {
    try {
      const isbn_number = req.params.isbn;
      const requestedBook = await getBookByIsbn(isbn_number);
      res.send(requestedBook);
    } catch (err) {
      if (err.status === 404) {
        res.status(404).json({ message: err.message });
      } else {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });
  
// // Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   const author = req.params.author;
//   const requestedBook = Object.values(books).filter((book) => book.author === author);
//   console.log(requestedBook);
//   return res.send(requestedBook)
// });
// Function to retrieve book details based on author
const getBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
      try {
        const requestedBooks = Object.values(books).filter((book) => book.author === author);
        if (requestedBooks.length === 0) {
          reject({ status: 404, message: `No books found by author '${author}'` });
        } else {
          resolve(requestedBooks);
        }
      } catch (err) {
        reject(err);
      }
    });
  };
  
  // Get book details based on author
  public_users.get('/author/:author', async (req, res) => {
    try {
      const author = req.params.author;
      const requestedBooks = await getBooksByAuthor(author);
      console.log(requestedBooks);
      res.send(requestedBooks);
    } catch (err) {
      if (err.status === 404) {
        res.status(404).json({ message: err.message });
      } else {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

// // Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   const title = req.params.title;
//   const requestedBook = Object.values(books).filter((book) => book.title === title);
//   return res.send(requestedBook);
// });
// Function to retrieve books based on title
const getBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
      try {
        const requestedBooks = Object.values(books).filter((book) => book.title.toLowerCase() === title.toLowerCase());
        if (requestedBooks.length === 0) {
          reject({ status: 404, message: `No books found with title '${title}'` });
        } else {
          resolve(requestedBooks);
        }
      } catch (err) {
        reject(err);
      }
    });
  };
  
  // Get all books based on title
  public_users.get('/title/:title', async (req, res) => {
    try {
      const title = req.params.title;
      const requestedBooks = await getBooksByTitle(title);
      res.send(requestedBooks);
    } catch (err) {
      if (err.status === 404) {
        res.status(404).json({ message: err.message });
      } else {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const requestedBook = books[isbn]
  if (requestedBook) {
    return res.send(requestedBook.reviews)
  }
});

module.exports.general = public_users;
