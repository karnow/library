const {ApolloServer} = require("apollo-server");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const initialData = require("./config/initialData");
const createDb = require("./data/db");
const createDataAccess = require("./dataAccess");
const searchFieldsByType = require("./config/searchFieldsByType");
const { Search } = require("./data/search");
const auth = require("./data/auth");



const db = createDb(initialData);
const search = new Search(db, searchFieldsByType);

const dataAccess = createDataAccess(db, search, auth);


const PORT = process.env.PORT || 4000
const BASE_ASSETS_URL = process.env.BASE_ASSETS_URL || "http://examples.devmastery.pl/assets";

function context({ req }) {
     return {
          dataAccess,
          currentUserDbId: auth.authenticateRequest(req, db),          
          assetsBaseUrl: BASE_ASSETS_URL
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    playground:true,
    introspection:true
    });

server.listen({port: PORT}).then((result) => console.log(result.url, result.port));


 
