// const todbId = externalId => Buffer.from(externalId, "base64").toString();
// const toExternalId = dbId => Buffer.from(dbId).toString("base64");

const decodeBase64 = base64String =>
  Buffer.from(base64String, "base64").toString();
const encodeBase64 = rawString => Buffer.from(rawString).toString("base64");

const toExternalId = (dbId, type) => encodeBase64(`${type}-${dbId}`);
const toTypeAndDbId = externalId => decodeBase64(externalId).split("-", 2);
const toDbId = externalId => toTypeAndDbId(externalId)[1];

const getAnythingByExternalId = (externalId, dataAccess) => {
const [type, dbId] = toTypeAndDbId(externalId);

  switch (type) {
    case "Book": {
      return dataAccess.getBookById(dbId);
    }
    case "Author": {
      return dataAccess.getAuthorById(dbId);
    }
    case "User": {
      return dataAccess.getUserById(dbId);
    }
    case "BookCopy": {
      return dataAccess.getBookCopyById(dbId);
    }
    default: {
      return null;
    }
  }
}
const getResourceByExternalId = (externalId, dataAccess) => {
  const [type, dbId] = toTypeAndDbId(externalId);
  return dataAccess.getResourceByIdAndType(dbId, type)
  
}
//funkcje autoryzujace dostep
function requireAuthorizedUser(currentUserDbId) {
  if (!currentUserDbId) {
    throw new Error("Unauthorized access. Please Log in");
  }
}

function requireAuthorizedAdmin(currentUserDbId, dataAccess) {
  console.log(currentUserDbId);
  requireAuthorizedUser(currentUserDbId);
  const currentUser = dataAccess.getUserById(currentUserDbId);
  if (!currentUser.isAdmin) {
    throw new Error("Unauthorized access. Please Log in as Admin");
  }
}

const id = resource => toExternalId(resource.id, resource.resourceType);


const resolvers = {
  Query: {
    books: (rootValue, { searchQuery, limit, offset, pageSize, pageNumber }, { dataAccess }) =>
    dataAccess.searchAndPaginateBooks(searchQuery, pageNumber, pageSize),
    authors:(rootValue,{ searchQuery } , { dataAccess}) => 
    dataAccess.searchAuthors(searchQuery),
    users: (rootValue, { searchQuery }, { dataAccess}) => 
    dataAccess.searchUsers(searchQuery),
    
    book:(rootValue,{id}, {dataAccess})=> dataAccess.getBookById(toDbId(id)),
    author:(rootValue,{id}, {dataAccess})=> dataAccess.getAuthorById(toDbId(id)),
    user:(rootValue,{id}, {dataAccess})=> dataAccess.getUserById(toDbId(id)),
    anything:(rootValue,{id}, {dataAccess})=> getAnythingByExternalId(id , dataAccess),
    everything:(rootValue,agrs, {dataAccess})=> [
      ...dataAccess.getAllBookCopies(),
      ...dataAccess.getAllAuthors(),
      ...dataAccess.getAllUsers(),
      ...dataAccess.getAllBooks() 
    ],
    resources:(rootValue,agrs, {dataAccess})=> [
      ...dataAccess.getAllBookCopies(),
      ...dataAccess.getAllAuthors(),
      ...dataAccess.getAllUsers(),
      ...dataAccess.getAllBooks()
    ],
    resource: (rootValue, { id }, { dataAccess }) => getResourceByExternalId(id, dataAccess),

    people:(rootValue,agrs, {dataAccess})=> [
      
      ...dataAccess.getAllAuthors(),
      ...dataAccess.getAllUsers(),
      
    ],
    currentUser: (rootValue, args, { dataAccess, currentUserDbId }) => 
      dataAccess.getUserById(currentUserDbId)
    
  },
  Mutation: {
    borrowBookCopy: (rootValue, { id }, { dataAccess, currentUserDbId }) => {
      requireAuthorizedUser(currentUserDbId);
      
      dataAccess.borrowBookCopy(toDbId(id), currentUserDbId);
      return dataAccess.getBookCopyById(toDbId(id));
    },
    returnBookCopy: (rootValue, { id }, { dataAccess, currentUserDbId }) => {
      requireAuthorizedUser(currentUserDbId);

      dataAccess.returnBookCopy(toDbId(id), currentUserDbId);
      return dataAccess.getBookCopyById(toDbId(id));
    },
    borrowRandomBook: (rootValue, args, { dataAccess, currentUserDbId }) => {
      requireAuthorizedUser(currentUserDbId);
      
      const id = dataAccess.borrowRandomCopy(currentUserDbId);
      console.log("to ja",id);
      return dataAccess.getBookCopyById(id);
    },
    createUser: (rootValue, { input }, { dataAccess ,currentUserDbId}) => {
      requireAuthorizedAdmin(currentUserDbId, dataAccess);
      try {
        return {
          success: true,
          message: "User successfully created",
          user: dataAccess.createUser(input)
        };
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
    },
    updateUser: (rootValue, { input: { id, name, info, password } }, { dataAccess,currentUserDbId }) => {
      requireAuthorizedAdmin(currentUserDbId, dataAccess);
      try {
        dataAccess.updateUser(toDbId(id), { name, info, password });
        return {
          success: true,
          message: "User successfully updated",
          user: dataAccess.getUserById(toDbId(id))
        };
      } catch (error) { 
        return {
          success: false,
          message: error.message
        };
      }
      
    },
    deleteUser: (rootValue, { id }, { dataAccess, currentUserDbId }) => {
       requireAuthorizedAdmin(currentUserDbId, dataAccess);
      try {
        dataAccess.deleteUser(toDbId(id));
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
    createAuthor: (rootValue, { input }, { dataAccess, currentUserDbId }) => {
       requireAuthorizedAdmin(currentUserDbId, dataAccess);
      try {
        return {
          success: true,
          message: "Author successfully created",
          author: dataAccess.createAuthor(input )
        };
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
      
    },
    updateAuthor: (rootValue, { input: { id, name, bio } }, { dataAccess, currentUserDbId }) => {
      requireAuthorizedAdmin(currentUserDbId, dataAccess);
      try {
        dataAccess.updateAuthor(toDbId(id), { name, bio });
        return {
          success: true,
          message: "Author successfully updated",
          author: dataAccess.getAuthorById(toDbId(id))
        };
      } catch (error) { 
        return {
          success: false,
          message: error.message
        };
      }
          
    },
    deleteAuthor: (rootValue, { id }, { dataAccess,currentUserDbId }) => {
      requireAuthorizedAdmin(currentUserDbId, dataAccess);
      try {
        dataAccess.deleteAuthor(toDbId(id));
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
    createBook: (rootValue, { input: { author_Id, title, description } }, { dataAccess, currentUserDbId }) => {
      requireAuthorizedAdmin(currentUserDbId, dataAccess);
      try {
        console.log(author_Id, title, description);
        const authorId = (toDbId(author_Id))
        return {
          success: true,
          message: "Book successfully created",
          book: dataAccess.createBook({authorId, title, description })
        };
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
           
    },
    updateBook: (rootValue, { input: { id, title, description } }, { dataAccess, currentUserDbId }) => {
      requireAuthorizedAdmin(currentUserDbId, dataAccess);
      try {
         dataAccess.updateBook(toDbId(id), { title, description });
        return {
          success: true,
          message: "Book successfully updated",
          book: dataAccess.getBookById(toDbId(id))
        };
      } catch (error) { 
        return {
          success: false,
          message: error.message
        };
      }      
    },

    deleteBook: (rootValue, { id }, { dataAccess, currentUserDbId }) => {
      requireAuthorizedAdmin(currentUserDbId, dataAccess);
      try {
        dataAccess.deleteBook(toDbId(id));
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
    createBookCopy: (rootValue, { input: { owner_Id, book_Id, borrower_Id } }, { dataAccess,currentUserDbId }) => {
      requireAuthorizedAdmin(currentUserDbId, dataAccess);
      try {
      const ownerId = (toDbId(owner_Id));
      const bookId = (toDbId(book_Id));
      const borrowerId = (toDbId(borrower_Id));
        return {
          success: true,
          message: "BookCopy successfully created",
          bookcopy: dataAccess.createBookCopy({ownerId, bookId, borrowerId})
        };
      } catch (error) { 
        return {
          success: false,
          message: error.message
        };
      }
     
    },
    updateBookCopy: (rootValue, { input: { id, owner_Id, book_Id, borrower_Id } }, { dataAccess, currentUserDbId }) => {
     requireAuthorizedAdmin(currentUserDbId, dataAccess);
      try {
      const ownerId = (toDbId(owner_Id));
      const bookId = (toDbId(book_Id));
      const borrowerId = (toDbId(borrower_Id));
      dataAccess.updateBookCopy(toDbId(id), { ownerId, bookId, borrowerId });
        
        return {
          success: true,
          message: "BookCopy successfully updated",
          bookcopy: dataAccess.getBookCopyById(toDbId(id))
        };
      } catch (error) { 
        return {
          success: false,
          message: error.message
        };
      }      
           
    },
    deleteBookCopy: (rootValue, { id }, { dataAccess,currentUserDbId }) => {
       requireAuthorizedAdmin(currentUserDbId, dataAccess);
      try {
        dataAccess.deleteBookCopy(toDbId(id));
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
    resetData: (rootValue, args, { dataAccess, currentUserDbId }) => {
      requireAuthorizedAdmin(currentUserDbId, dataAccess);
      try {
        dataAccess.revertToInitialData();
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
    },
    logIn: (rootValue, { input:{email, password} }, { dataAccess }) => {
      try {
        const { token, currentUser } = dataAccess.logIn(email, password)
        return {
          success: true,
          message: "You've successfully logged in",
          token,
          currentUser
        };
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
    },
    
    signUp: (rootValue, { input }, { dataAccess ,currentUserDbId}) => {
        
      try {
        dataAccess.createUser(input);
        const { token, currentUser } = dataAccess.logIn(input.email, input.password);
          return {
            success: true,
            message: "You've successfully signed up",
            token,
            currentUser
           };
        } catch (error) {
          return {
            success: false,
            message: error.message
          };
        }
    },
  },
  
  CurrentUser: {
    id,
    isAdmin: currentUser =>!!currentUser.isAdmin
  },

  Book: {
    
    id,
    title: (book) => book.title.toUpperCase(),
    author: (book, agrs, {dataAccess}) => dataAccess.getAuthorById(book.authorId),
    cover: book => ({
      path: book.coverPath
    }),
    copies: (book, agrs, {dataAccess}) =>
    dataAccess.getBookCopiesByBookId(book.id)
     
     
  },

  Author: {
    id,
    books: (author, agrs, {dataAccess}) => dataAccess.getBooksByAuthorId(author.id),
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
    ownedBookCopies: (user, args, { dataAccess }) => dataAccess.getBookCopiesByOwnerId(user.id),
    borrowedBookCopies: (user, args, { dataAccess }) =>
      dataAccess.getBookCopiesByBorrowerId(user.id)
  },

  BookCopy: {
    id,
    book: (bookCopy, args, { dataAccess }) => dataAccess.getBookById(bookCopy.bookId),
    owner: (bookCopy, args, { dataAccess }) => dataAccess.getUserById(bookCopy.ownerId),
    borrower: (bookCopy, args, { dataAccess }) =>
      bookCopy.borrowerId && dataAccess.getUserById(bookCopy.borrowerId)
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

