const db = require("./db");



const resolvers = {
  Book: {
    title: (book) => book.title.toUpperCase(),
    author: (book, agrs, {db}) => db.getAuthorById(book.authorId),
    cover: book => ({
      path: book.coverPath
    })
    // author: parent => db.getAuthorById(1),
    
  },
  Author: {
    
    books: (author, agrs, {db}) => author.bookIds.map(db.getBookById),
    photo:author => ({
      path: author.photoPath
    })
  },
  Avatar: {
    image: avatar => ({
      path: avatar.imagePath
    })
  },
  Image: {
    url: (image,args, context) => context.assetsBaseUrl + image.path
  },
  User: {
    email: user => {
      console.log("Someone asks about an email.");
      return user.email;
    }
  },
  Query: {
    books: (rootValue, agrs, {db}) =>db.getAllBooks(),
    authors:(rootValue, agrs, {db}) => db.getAllAuthors(),
    users:(rootValue, agrs, {db}) => db.getAllUsers(),
    book:(rootValue,{id}, {db})=> db.getBookById(id),
    author:(rootValue,{id}, {db})=> db.getAuthorById(id),
    user:(rootValue,{id}, {db})=> db.getUserById(id)
  }
};

module.exports = resolvers;

