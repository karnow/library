const { gql } = require("apollo-server");

const typeDefs = gql`
schema {
    query: Query 
   
}
type Query {
    books: [Book!]!,
    authors: [Author!]!,
    users: [User!]!
}
type Author {
    name: String!,
    photo: Image!,
    books: [Book]
}
type Book {
    title: String!,
    cover: Image!,
    author: Author
}
type User {
    name: String!,
    email: String!
    avatar:Avatar!
}
type Image {
    url:String!
}
type Avatar {
    image: Image!,
    color: String!
}

`;

module.exports = typeDefs;
