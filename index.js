const {ApolloServer} = require("apollo-server");
const typeDefs = require("./typeDefs");
const rootValue = require("./rootValue");
const resolvers = require("./resolvers");

const PORT = process.env.PORT || 4000

const server = new ApolloServer({typeDefs, rootValue, resolvers, playground:true, introspection:true});

server.listen({port: PORT}).then((result) => console.log(result.url, result.port));


 
