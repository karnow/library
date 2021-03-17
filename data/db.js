

function createDb(initialData) {

  let data = {};

  const listeners = [];

  function registerListener(listener) {
    listeners.push(listener);
  }

  function notifyAboutChange(change, resourceType, id) {
    listeners.forEach(listener => listener.onDbChange(change, resourceType, id));
  }

  initDb();

  function initDb() {
    data = initialData();
    Object.keys(data).forEach(resourceType => { initializeNextId(resourceType); console.log(resourceType) })
    notifyAboutChange("init");
  }

  //nisko poziomowe funkcje możemy jest traktować jako zapytania np sql
  function findResourceByIdAndType(id, resourceType) {
    const resources = findAllResourcesByType(resourceType);
    const resource = resources.find(resource => resource.id === id);
    if (!resource) {
      throw new Error(`Could not find resource by id '${id}`)
    }
    return resource;
  }

  function findAllResourcesByType(resourceType) {
    const resources = data[resourceType];
    if (!resources) {
      throw new Error(`Unrecognized resource type '${resourceType}'`)
    }
    return resources;
  }



  function deleteResource(id, resourceType) {
    const resources = findAllResourcesByType(resourceType);
    const index = resources.findIndex(resource => resource.id === id);
    if (index < 0) {
      throw new Error(`Could not find resource by id '${id}`);
    }
    notifyAboutChange("delete", resourceType, id);
    resources.splice(index, 1);
  }

  function updateResource(id, resourceType, resourceData) {
    const resources = findAllResourcesByType(resourceType);
    const index = resources.findIndex(resource => resource.id === id);
    if (index < 0) {
      throw new Error(`Could not find resource by id '${id}`);
    }
    const existingResource = resources[index];
    resources[index] = {
      ...existingResource,
      ...resourceData,
      id,
      resourceType
    }
    notifyAboutChange("update", resourceType, id);
  }

  function createResource(resourceType, resourceData) {
    const resources = findAllResourcesByType(resourceType);
    const id = generateNextId(resourceType);
    const createResource = {
      ...resourceData,
      resourceType,
      id
    };
    resources.push(createResource);
    notifyAboutChange("create", resourceType, id);
    return createResource;
  }

  //funkcje pomocnicze

  function initializeNextId(resourceType) {
    const resources = findAllResourcesByType(resourceType);
    if (!resources.nextId) {
      resources.nextId = resources.length + 1;
    }
  }
  function generateNextId(resourceType) {
    const resources = findAllResourcesByType(resourceType);
    return `${resources.nextId++}`;
  }



  const db = {
    initDb,
    findResourceByIdAndType,
    findAllResourcesByType,
    createResource,
    updateResource,
    deleteResource,
    registerListener

  }
  return db;
}

module.exports = createDb;