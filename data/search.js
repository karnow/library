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
    db.registerListener(this); //przekazanie instancji obiektu search
    this.searchFieldsByType = searchFieldsByType;
    this.rebulidAllIndices();
    
  }

  rebulidAllIndices() {
    this.indices = {},
      Object.keys(this.searchFieldsByType).forEach((resourceType) => {
        this.rebulidIndex(resourceType);
    })
  }

  onDbChange(change, resourceType, id) {
    if (change === "init") {
      this.rebulidAllIndices();
    }
    if (!this.searchFieldsByType[resourceType]) {
      console.info("Change event ignored - unsupported resource type", change, resourceType, id);
      return;
    }
    this.rebulidIndex(resourceType);

    console.log(change, resourceType, id);
  }
  rebulidIndex(resourceType) {
    const searchFields = this.searchFieldsByType[resourceType];
    if (!searchFields) {
      throw new Error(`Search fields are not defined for this resource type '${resourceType}`);
    }
    this.indices[resourceType] = initIndex(this.db, searchFields, resourceType);
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