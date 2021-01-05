const db = require("./db");

const todbId = externalId => Buffer.from(externalId, "base64").toString();
const toExternalId = dbId => Buffer.from(dbId).toString("base64");


const resolvers = {
  Query: {
    books: (rootValue, { searchQuery }, { db, search }) =>
    searchQuery.length > 0 ? search.findBooks(searchQuery) : db.getAllBooks(),
    authors:(rootValue,{ searchQuery } , {db, search}) => 
    searchQuery.length > 0 ? search.findAuthors(searchQuery) : db.getAllAuthors(),
    users: (rootValue, { searchQuery }, { db, search }) => 
    searchQuery.length > 0 ? search.findUsers(searchQuery) : db.getAllUsers(),
    book:(rootValue,{id}, {db})=> db.getBookById(todbId(id)),
    author:(rootValue,{id}, {db})=> db.getAuthorById(todbId(id)),
    user:(rootValue,{id}, {db})=> db.getUserById(todbId(id))
  },

  Book: {
    id: book => toExternalId(book.id),
    title: (book) => book.title.toUpperCase(),
    author: (book, agrs, {db}) => db.getAuthorById(book.authorId),
    cover: book => ({
      path: book.coverPath
    })
    // author: parent => db.getAuthorById(1),
    
  },

  Author: {
    id: author => toExternalId(author.id),
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
    id: user => toExternalId(user.id),
    email: user => {
      console.log("Someone asks about an email.");
      return user.email;
    }
  },
};

module.exports = resolvers;

