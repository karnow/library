const getResourceByIdAndType = (id, type) => {
  try {
    return ({
      ...findResourceByIdAndType(id, type)
    })
  } catch (error) {
    return null;
  }
}

function getAllResourcesByType(resourceType) {
  return[...findAllResourcesByType(resourceType)]

}

const getBookById = id => getResourceByIdAndType(id, "Book");
const getAuthorById = (id) =>getResourceByIdAndType(id, "Author");
const getUserById = (id) =>getResourceByIdAndType(id, "User");
const getBookCopyById = id =>getResourceByIdAndType(id, "BookCopy");

const getBooksByAuthorId = authorId =>
  getAllBooks().filter(book => book.authorId === authorId);


const getAllBooks = () => getAllResourcesByType("Book");
const getAllAuthors = () => getAllResourcesByType("Author");
const getAllUsers = () => getAllResourcesByType("User");
const getAllBookCopies = () => getAllResourcesByType("BookCopy");

const getBookCopiesByBookId =(bookId) =>
getAllBookCopies().filter(bookCopy =>bookCopy.bookId === bookId);
const getBookCopiesByOwnerId = ownerId =>
  getAllBookCopies().filter(bookCopy => bookCopy.ownerId === ownerId);
const getBookCopiesByBorrowerId = borrowerId =>
  getAllBookCopies().filter(bookCopy => bookCopy.borrowerId === borrowerId);

//mutation
const borrowBookCopy = (bookCopyId, borrowerId) => {
  const bookCopy = findResourceByIdAndType(bookCopyId, "BookCopy");
  if (!!bookCopy.borrowerId) {
    throw new Error("Cannot borrow the book copy. It is already borrowed.")
  }
  if (bookCopy.ownerId === borrowerId){
    throw new Error("you cannot borrow your own book")
  }
  updateBookCopy(bookCopyId, {
    ...bookCopy,
    borrowerId
  })
  
}


const borrowRandomCopy = (borrowerdId) => {
  const BookCopy = getAllBookCopies();
  // const index = data.BookCopy.findIndex((el,index)=>el.borrowerId=== null && el.ownerId !== borrowerdId);
  const index = BookCopy.findIndex((el,index)=>el.borrowerId=== null && el.ownerId !== borrowerdId);
    
    if (index === -1){
      throw new Error ('All books are on loan')
    }
  const bookCopy = data.BookCopy[index];
  bookCopy.borrowerId = borrowerdId;
  // const toId = index => `${index + 1}`;
    // const id = toId(index);
    const id = `${index + 1}`; 
    return id; 
     
  }
    
  
const returnBookCopy = (bookCopyId, borrowerId) => {
  const bookCopy = findResourceByIdAndType(bookCopyId, "BookCopy")
  
  if (!bookCopy.borrowerId) {
    throw new Error("Cannot return the book copy. It hasn't been borrowed.")
  }
  if (bookCopy.borrowerId !== borrowerId){
     throw new Error("Book copy can only be returned by the user who borrowed it")
  }
  updateBookCopy(bookCopyId, {
    ...bookCopy,
    borrowerId: null
  })
}


function updateBookCopy(id, bookCopyData) {
  const { ownerId, bookId, borrowerId } = bookCopyData;
  
  if (!getUserById(ownerId)) {
    throw new Error(`BookCopy needs valid ownerId '${ownerId}'`);
  }  
  if (!getBookById(bookId)) {
    throw new Error(`BookCopy needs valid BookId '${bookId}'`);
  }
  
  if (borrowerId && !getUserById(borrowerId)) {
    throw new Error(`BookCopy needs valid or empty borrowerId '${borrowerdId}'`);
  }
  updateResource(id, "BookCopy", { ownerId, bookId, borrowerId });

}



function updateUser(id, userData) {
  const { name, info } = userData;
  if (!name || name.length < 0) {
    throw new Error(`user needs valid name and cannot be empty `);
  }
  if (!info || info.length < 0) {
    throw new Error(`user needs calid info cannot be empty `);
  }
  updateResource(id, "User", { name, info });
}


function updateBook(id, bookData) {
  const { title, description } = bookData;
  if (!title) {
    throw new Error(`Book needs title cannot be empty '${title}`);
  }
  if (!description) {
    throw new Error(`Book needs description cannot be empty '${description}`);
  }
  updateResource(id, "Book", { title, description });
}

function updateAuthor(id, authorData) {
  const { name, bio } = authorData;
  if (!name) {
    throw new Error(`Author needs name cannot be empty '${name}`);
  }
  if (!bio) {
    throw new Error(`Author needs bio cannot be empty '${bio}`);
  }
  updateResource(id, "Author", { name, bio });
}

const VALID_AVATAR_COLORS = ["red", "green", "blue", "yellow", "magenta", "pink", "black"];

function createUser(userData) {
  const { name, email, info } = userData;
  if (!name || name.length < 1) {
    throw new Error("User needs valid name");
  }
  if (!email || !email.match(/@/)) {
    throw new Error("User needs valid email");
  }
  if (!info || info.length < 1) {
    throw new Error("User needs valid info");
  }
  const color = VALID_AVATAR_COLORS[Math.floor(Math.random() * VALID_AVATAR_COLORS.length)];
  const avatarName = `${Math.random()>0.5 ? "m" : "w"}${Math.ceil(Math.random()* 25)}`
  return createResource("User", {    
    name,
    email,
    info,
    avatar: {
      imagePath: `/images/avatars/${avatarName}.png`,
      color
    }
  });
}

function createBookCopy(bookCopyData) {
  const { ownerId, bookId, borrowerId } = bookCopyData;
  if (!getUserById(ownerId)) {
    throw new Error(`BookCopy needs valid ownerId '${ownerId}'`);
  }  
  if (!getBookById(bookId)) {
    throw new Error(`BookCopy needs valid BookId '${bookId}'`);
  }
  
  if (borrowerId && !getUserById(borrowerId)) {
    throw new Error(`BookCopy needs valid or empty borrowerId '${borrowerdId}'`);
  }
  return createResource("BookCopy", {
      ownerId,
      borrowerId,
      bookId
    })
}

const VALID_COVER =["harry1","harry2","harry3","harry4","harry5","harry6","harry7","expanse1","expanse2","expanse3","expanse4","expanse5","expanse6","expanse7","expanse7","witcher1","witcher2","witcher3","witcher4","witcher5"];
function createBook(bookData) {
  const { authorId, title, description } = bookData;
  if (!title) {
    throw new Error(`Book needs title cannot be empty`);
  }
  if (!description) {
    throw new Error(`Book needs description cannot be empty`);
  }
  if (!getAuthorById(authorId)) {
    throw new Error(`Book needs valid authorId`);
  }
  const cover = VALID_COVER[Math.floor(Math.random() * VALID_COVER.length)]
  return createResource("Book", { 
      authorId,
      title,
      coverPath: `/images/book-covers/${cover}.jpg`,
      description
     }
  )
}
const VALID_PHOTO = ["j-k-rowling", "james-s-a-corey", "andrzej-sapkowski"];
function createAuthor(authorData) {
  const { name, bio } = authorData;
  if (!name) {
    throw new Error(`Author needs name cannot be empty `);
  }
  if (!bio) {
    throw new Error(`Author needs bio cannot be empty`);
  }
  const cover = VALID_PHOTO[Math.floor(Math.random() * VALID_PHOTO.length)]
  return createResource("Author", {
      name,
      photoPath: `/images/book-authors/${cover}.jpg`,
      bio
     }
  )
}


/////


function deleteBookCopy(id) {
  deleteResource(id, "BookCopy");
    
}

function deleteUser(id) {
  getBookCopiesByBorrowerId(id).forEach(bookCopy => returnBookCopy(bookCopy.id, id));
  getBookCopiesByOwnerId(id).forEach(bookCopy => deleteBookCopy(bookCopy.id));
  deleteResource(id, "User");
}

function deleteBook(id) {
  getBookCopiesByBookId(id).forEach(bookCopy => deleteBookCopy(bookCopy.id));
  deleteResource(id, "Book");
}
function deleteAuthor(id) {
  getBooksByAuthorId(id).forEach(book => deleteBook(book.id));
  deleteResource(id, "Author");
  
}


// deleteUser("1")
// const user = createUser({ name: "Karol", email: "karol@onet.pl", info: "to ja stary dziad" });
// console.log(user)
//  const Bookcopi = createBookCopy({ownerId:"1", borrowerId:"2",bookId:"1"})
// console.log(Bookcopi);
// const Book = createBook({ authorId: "1", title:"dzieci z bulerbin",description:"cholera jaka fajna ksiązka" })
// console.log(Book);
// const author = createAuthor({ name: "Wiesław Podlach", bio: "Ksiądz z Amager" })
// console.log(author);
initDb();
//inicjalizacja bazy danych i indeksowania nowych recordów
function revertToInitialData() {
  initDb();
}

const db = {
 getAllBooks,
 getBookById,
 deleteBook,
 updateBook,
 createBook,
 
 getAllAuthors,
 getAuthorById,
 deleteAuthor,
 updateAuthor,
 createAuthor,

 getAllUsers,
 getUserById,
 deleteUser,
 updateUser,
 createUser,
 
  
 getBooksByAuthorId,
 
 getBookCopyById,
 getAllBookCopies,
 getBookCopiesByBookId,
 getBookCopiesByOwnerId,
 getBookCopiesByBorrowerId,
 borrowBookCopy,
 returnBookCopy,
 borrowRandomCopy,
 deleteBookCopy,
 updateBookCopy,
 createBookCopy,
 
 
 getResourceByIdAndType,
 getAllResourcesByType,
 revertToInitialData
 
};

module.exports = db; 