const searchFieldsByType = {
  "Book": [["title", { boost: 10 }], ["description", {}]],
  "User": [["name", { boost: 10 }], ["info", {}]],
  "Author": [["name", { boost: 10 }], ["bio", {}]]
}

module.exports = searchFieldsByType;