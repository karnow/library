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

class Search {
  constructor(db) {
    this.db = db;
    this.booksIndex = initBooksIndex(this.db);
  }

  findBooks(searchQuery) {
    const results = [];
    this.booksIndex
      .search(searchQuery)
      .forEach(result => results.push(this.db.getBookById(result.ref)));
    return results;
  }
}

module.exports = {
  Search
};