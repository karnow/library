const lunr = require("lunr");

function initIndex(db, searchFields, resourceType) {
  return lunr(function() {
    this.ref("id");
    searchFields.forEach(([name, options]) => {
      this.field(name, options);
    });
      db.findAllResourcesByType(resourceType).forEach(function(book) {
      this.add(book);
    }, this);
  });
}


class Search {
  constructor(db, searchFieldsByType) {
    this.db = db;
    this.searchFieldsByType = searchFieldsByType;
    this.indices = {},
      Object.entries(this.searchFieldsByType).forEach(([resourceType, searchFields]) => {
        this.indices[resourceType] = initIndex(this.db, searchFields, resourceType);
    })
  }

  findResources(searchQuery, resourceType) {
    if (!this.indices[resourceType]) {
      throw new Error(`index for this resource type does not exists '${resourceType}`);
    }
    const results = [];
    this.indices[resourceType]
      .search(searchQuery)
      .forEach(result => results.push(this.db.findResourceByIdAndType(result.ref, resourceType)));
    return results;
  }
  
}

module.exports = {
  Search
};