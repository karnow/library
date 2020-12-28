const db = require("./db");


console.log("A book", db.getAllBooks());
console.log("A Author", db.getAuthorById(3));
console.log("A book", db.getUserById(3));

const rootValue = () => {
    return {
      books: db.getAllBooks(),
      authors: db.getAllAuthors(),
      users: db.getAllUsers()
    };
  };
  
  module.exports = rootValue;