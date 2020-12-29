const db = require("./db");

const resolvers = {
  Book: {
    title: parent => parent.title.toUpperCase(),
    author: parent => db.getAuthorById(parent.authorId),
    // author: parent => db.getAuthorById(1),
    
  },
  Author: {
    books: parent => parent.bookIds.map(db.getBookById)
  },
  User: {
      
    email: parent => {
      console.log("Someone asks about an email.");
      return parent.email;
    }
  },
  Query: {
    users: parent => {
      console.log("Query's parent", parent);
      return parent.users;
    }
  }
};

module.exports = resolvers;

