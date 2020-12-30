const db = require("./db");
const BASE_ASSETS_URL = "http://examples.devmastery.pl/assets";

const resolvers = {
  Book: {
    title: parent => parent.title.toUpperCase(),
    author: parent => db.getAuthorById(parent.authorId),
    cover: parent => ({
      path: parent.coverPath
    })
    // author: parent => db.getAuthorById(1),
    
  },
  Author: {
    
    books: parent => parent.bookIds.map(db.getBookById),
    
    photo: parent => ({
      path: parent.photoPath
    })
  },
  Avatar: {
    image: parent => ({
      path: parent.imagePath
    })
  },
  Image: {
    url: parent => BASE_ASSETS_URL + parent.path
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

