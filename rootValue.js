const db = require("./db");


// console.log("A book", db.getAllBooks());
// console.log("A Author", db.getAuthorById(3));
// console.log("A book", db.getUserById(3));
// const author = db.getAuthorById(2);
// const books = author.bookIds.map(db.getBookById);
// console.log("An author", author);
// console.log("wrote those books", books);

const book = db.getBookById(2);
const author = db.getAuthorById(book.authorId);
const authorsBooks = author.bookIds.map(db.getBookById);
console.log({book, author, authorsBooks});

const rootValue = () => {
    return {
      books: db.getAllBooks(),
      authors: db.getAllAuthors(),
      users: db.getAllUsers()
    };
  };
  
  module.exports = rootValue;