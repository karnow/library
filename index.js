const {ApolloServer} = require("apollo-server");
const typeDefs = require("./typeDefs");
const rootValue = require("./rootValue");
const resolvers = require("./resolvers");

const PORT = process.env.PORT || 4000
const BASE_ASSETS_URL = process.env.BASE_ASSETS_URL || "http://examples.devmastery.pl/assets";

const server = new ApolloServer({
    typeDefs,
     rootValue,
      resolvers,
      context: {
          assetsBaseUrl: BASE_ASSETS_URL
      },
       playground:true,
        introspection:true
    });

server.listen({port: PORT}).then((result) => console.log(result.url, result.port));


 
