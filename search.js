const lunr = require("lunr");

function initBooksIndex(db) {
  return lunr(function() {
    this.ref("id");
    this.field("title", { boost: 10 });
    this.field("description");
    db.getAllBooks().forEach(function(book) {
      this.add(book);
    }, this);
  });
}

function initUsersIndex(db) {
  return lunr(function() {
    this.ref("id");
    this.field("name" );
    this.field("email");
    this.field("info");
    db.getAllUsers().forEach(function(user) {
      this.add(user);
    }, this);
  });
}
function initAuthorIndex(db) {
  return lunr(function() {
    this.ref("id");
    this.field("name" );
    this.field("bio");
    db.getAllAuthors().forEach(function(author) {
      this.add(author);
    }, this);
  });
}

class Search {
  constructor(db) {
    this.db = db;
    this.booksIndex = initBooksIndex(this.db);
    this.usersIndex = initUsersIndex(this.db);
    this.authorsIndex = initAuthorIndex(this.db);
  }

  findBooks(searchQuery) {
    const results = [];
    this.booksIndex
      .search(searchQuery)
      .forEach(result => results.push(this.db.getBookById(result.ref)));
     
    return results;
  }

  findUsers(searchQuery) {
    const results = [];
    this.usersIndex
      .search(searchQuery)
      .forEach(result => results.push(this.db.getUserById(result.ref)));
      
    return results;
  }
  
  findAuthors(searchQuery) {
    const results = [];
    this.authorsIndex
      .search(searchQuery)
      .forEach(result => results.push(this.db.getAuthorById(result.ref)));
      
    return results;
  }

}

module.exports = {
  Search
};