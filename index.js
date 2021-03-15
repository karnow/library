const {ApolloServer} = require("apollo-server");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const db = require("./db");
const createDataAccess = require("./dataAccess");
const { Search } = require("./search");



const dataAccess = createDataAccess(db);

const PORT = process.env.PORT || 4000
const BASE_ASSETS_URL = process.env.BASE_ASSETS_URL || "http://examples.devmastery.pl/assets";

const server = new ApolloServer({
    typeDefs,
     resolvers,
      context: {
          dataAccess,
          currentUserDbId: "2",
          search: new Search(dataAccess),
          assetsBaseUrl: BASE_ASSETS_URL
      },
       playground:true,
        introspection:true
    });

server.listen({port: PORT}).then((result) => console.log(result.url, result.port));


 
