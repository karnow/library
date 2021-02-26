const { getBookById, createBookCopy } = require("./db");
const db = require("./db");

// const {nanoid} = require('nanoid');

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
    case "BookCopy": {
      return db.getBookCopyById(dbId);
    }
    default: {
      return null;
    }
  }
}
const getResourceByExternalId = (externalId, db) => {
  const [type, dbId] = toTypeAndDbId(externalId);
  return db.getResourceByIdAndType(dbId, type)
  
}

const id = resource => toExternalId(resource.id, resource.resourceType);


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
      ...db.getAllBookCopies(),
      ...db.getAllAuthors(),
      ...db.getAllUsers(),
      ...db.getAllBooks()
    ],
    resources:(rootValue,agrs, {db})=> [
      ...db.getAllBookCopies(),
      ...db.getAllAuthors(),
      ...db.getAllUsers(),
      ...db.getAllBooks()
    ],
    resource: (rootValue, { id }, { db }) => getResourceByExternalId(id, db),

    people:(rootValue,agrs, {db})=> [
      
      ...db.getAllAuthors(),
      ...db.getAllUsers(),
      
    ],
  },
  Mutation: {
    borrowBookCopy: (rootValue, { id }, { db, currentUserDbId }) => {
      db.borrowBookCopy(toDbId(id), currentUserDbId);
      return db.getBookCopyById(toDbId(id));
    },
    returnBookCopy:(rootValue, {id}, {db, currentUserDbId}) => {
      db.returnBookCopy(toDbId(id), currentUserDbId);
      return db.getBookCopyById(toDbId(id));
    },
    borrowRandomBook:(rootValue, args, { db, currentUserDbId }) => {
      const id = db.borrowRandomCopy(currentUserDbId);
      console.log(id);
      return db.getBookCopyById(id);
    },
    createUser: (rootValue, { name, email, info }, { db }) => {
      try {
        return {
          success: true,
          message: "User successfully created",
          user: db.createUser({ name, email, info })
        };
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
    },
    updateUser: (rootValue, { id, name, info }, { db }) => {
      try {
        db.updateUser(toDbId(id), { name, info });
        return {
          success: true,
          message: "User successfully updated",
          user: db.getUserById(toDbId(id))
        };
      } catch (error) { 
        return {
          success: false,
          message: error.message
        };
      }
      
    },
    deleteUser: (rootValue, { id }, { db }) => {
      try {
        db.deleteUser(toDbId(id));
        return {
          success: true,
          message: "User successfully deleted",
          id
        };
      } catch (error) { 
        return {
          success: false,
          message: error.message
        };
      }      
    },
    createAuthor: (rootValue, { name, bio }, { db }) => {
      try {
        return {
          success: true,
          message: "Author successfully created",
          author: db.createAuthor({ name, bio })
        };
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
      
    },
    updateAuthor: (rootValue, { id, name, bio }, { db }) => {
      try {
        db.updateAuthor(toDbId(id), { name, bio });
        return {
          success: true,
          message: "Author successfully updated",
          author: db.getAuthorById(toDbId(id))
        };
      } catch (error) { 
        return {
          success: false,
          message: error.message
        };
      }
          
    },
    deleteAuthor: (rootValue, { id }, { db }) => {
      try {
        db.deleteAuthor(toDbId(id));
        return {
          success: true,
          message: "Author successfully deleted",
          id
        };
      } catch (error) { 
        return {
          success: false,
          message: error.message
        };
      }    
          
    },
    createBook: (rootValue, { author_Id, title, description }, { db }) => {
      try {
        console.log(author_Id, title, description);
        const authorId = (toDbId(author_Id))
        return {
          success: true,
          message: "Book successfully created",
          book: db.createBook({authorId, title, description })
        };
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
           
    },
    updateBook: (rootValue, { id, title, description }) => {
      try {
         db.updateBook(toDbId(id), { title, description });
        return {
          success: true,
          message: "Book successfully updated",
          book: getBookById(toDbId(id))
        };
      } catch (error) { 
        return {
          success: false,
          message: error.message
        };
      }      
    },

    deleteBook: (rootValue, { id }, { db }) => {
      try {
        db.deleteBook(toDbId(id));
        return {
          success: true,
          message: "Book successfully deleted",
          id
        };
      } catch (error) { 
        return {
          success: false,
          message: error.message
        };
      }    
     
    },
    createBookCopy: (rootValue, { owner_Id, book_Id, borrower_Id }, { db }) => {
      try {
      const ownerId = (toDbId(owner_Id));
      const bookId = (toDbId(book_Id));
      const borrowerId = (toDbId(borrower_Id));
        return {
          success: true,
          message: "BookCopy successfully created",
          bookcopy: db.createBookCopy({ownerId, bookId, borrowerId})
        };
      } catch (error) { 
        return {
          success: false,
          message: error.message
        };
      }
     
    },
    updateBookCopy: (rootValue, { id, owner_Id, book_Id, borrower_Id }, { db }) => {
      try {
      const ownerId = (toDbId(owner_Id));
      const bookId = (toDbId(book_Id));
      const borrowerId = (toDbId(borrower_Id));
      db.updateBookCopy(toDbId(id), { ownerId, bookId, borrowerId });
        
        return {
          success: true,
          message: "BookCopy successfully updated",
          bookcopy: db.getBookCopyById(toDbId(id))
        };
      } catch (error) { 
        return {
          success: false,
          message: error.message
        };
      }      
           
    },
    deleteBookCopy: (rootValue, { id }, { db }) => {
      try {
        db.deleteBookCopy(toDbId(id));
        return {
          success: true,
          message: "BookCopy successfully deleted",
          id
        };
      } catch (error) { 
        return {
          success: false,
          message: error.message
        };
      }    
    
    },
    resetData: (rootValue, args, { db }) => {
      try {
        db.revertToInitialData();
        return {
          success: true,
          message: "Successfully restored initial data"
          
        };
      } catch (error) { 
        return {
          success: false,
          message: error.message
        };
      }       
    }

  },

  Book: {
    
    id,
    title: (book) => book.title.toUpperCase(),
    author: (book, agrs, {db}) => db.getAuthorById(book.authorId),
    cover: book => ({
      path: book.coverPath
    }),
    copies: (book, agrs, {db}) =>
    db.getBookCopiesByBookId(book.id)
     
     
  },

  Author: {
    id,
    books: (author, agrs, {db}) => db.getBooksByAuthorId(author.id),
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
    id,
    email: user => {
      console.log("Someone asks about an email.");
      return user.email;
    },
    ownedBookCopies: (user, args, { db }) => db.getBookCopiesByOwnerId(user.id),
    borrowedBookCopies: (user, args, { db }) =>
      db.getBookCopiesByBorrowerId(user.id)
  },

  BookCopy: {
    id,
    book: (bookCopy, args, { db }) => db.getBookById(bookCopy.bookId),
    owner: (bookCopy, args, { db }) => db.getUserById(bookCopy.ownerId),
    borrower: (bookCopy, args, { db }) =>
      bookCopy.borrowerId && db.getUserById(bookCopy.borrowerId)
  },

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
      if (anything.ownerId) {
        return "BookCopy";
      }
      return null;

    }
  },

  Resource: {
    __resolveType: resource => resource.resourceType
        
  },

  Person: {
    __resolveType: resource => resource.resourceType
        
  },
  MutationResult: {
    __resolveType: ()=>null
  }
};

module.exports = resolvers;

