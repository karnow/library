const db = require("./db");

const {nanoid} = require('nanoid');

// const todbId = externalId => Buffer.from(externalId, "base64").toString();
// const toExternalId = dbId => Buffer.from(dbId).toString("base64");
const decodeBase64 = base64String =>
  Buffer.from(base64String, "base64").toString();
const encodeBase64 = rawString => Buffer.from(rawString).toString("base64");

const toExternalId = (dbId, type) => encodeBase64(`${type}-${dbId}`);
const toTypeAndDbId = externalId => decodeBase64(externalId).split("-", 2);
const toDbId = externalId => toTypeAndDbId(externalId)[1];

const getAnythingByExternalId = (externalId, db) => {
  const [type, dbId] = toTypeAndDbId(externalId);

  switch (type) {
    case "Book": {
      return db.getBookById(dbId);
    }
    case "Author": {
      return db.getAuthorById(dbId);
    }
    case "User": {
      return db.getUserById(dbId);
    }
    default: {
      return null;
    }
  }
}



const resolvers = {
  Query: {
    books: (rootValue, { searchQuery }, { db, search }) =>
    searchQuery.length > 0 ? search.findBooks(searchQuery) : db.getAllBooks(),
    authors:(rootValue,{ searchQuery } , {db, search}) => 
    searchQuery.length > 0 ? search.findAuthors(searchQuery) : db.getAllAuthors(),
    users: (rootValue, { searchQuery }, { db, search }) => 
    searchQuery.length > 0 ? search.findUsers(searchQuery) : db.getAllUsers(),
    
    book:(rootValue,{id}, {db})=> db.getBookById(toDbId(id)),
    author:(rootValue,{id}, {db})=> db.getAuthorById(toDbId(id)),
    user:(rootValue,{id}, {db})=> db.getUserById(toDbId(id)),
    anything:(rootValue,{id}, {db})=> getAnythingByExternalId(id , db),
    everything:(rootValue,agrs, {db})=> [
      ...db.getAllAuthors(),
      ...db.getAllUsers(),
      ...db.getAllBooks()
    ]
  },

  Book: {
    
    id: book => toExternalId(book.id, "Book"),
    title: (book) => book.title.toUpperCase(),
    author: (book, agrs, {db}) => db.getAuthorById(book.authorId),
    cover: book => ({
      path: book.coverPath
    })
    // author: parent => db.getAuthorById(1),
    
  },

  Author: {
    id: author => toExternalId(author.id, "Author"),
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
    id: user => toExternalId(user.id, "User"),
    email: user => {
      console.log("Someone asks about an email.");
      return user.email;
    }
  },

  // BookCopy: {
  //   id: bookCopy => toExternalId(bookCopy.id, "BookCopy"),
  //   book: (bookCopy, args, { db }) => db.getBookById(bookCopy.bookId),
  //   owner: (bookCopy, args, { db }) => db.getUserById(bookCopy.ownerId),
  //   borrower: (bookCopy, args, { db }) =>
  //     bookCopy.borrowerId && db.getUserById(bookCopy.borrowerId)
  // },

  Anything: {
    __resolveType: (anything) => {
      if (anything.title) {
        return "Book";
      }
      if (anything.bio) {
        return "Author";
      }
      if (anything.info) {
        return "User";
      }
      return null;

    }
  },
  
};

module.exports = resolvers;

