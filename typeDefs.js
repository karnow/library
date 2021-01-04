const { gql } = require("apollo-server");

const typeDefs = gql`
schema {
    query: Query 
   
}
type Query {
    books: [Book!]!,
    authors: [Author!]!,
    users: [User!]!,
    book(id: Int!): Book,
    author(id: Int!): Author,
    user(id: Int!): User
}
type Author {
    id: Int!,
    name: String!,
    photo: Image!,
    bio: String!,
    books: [Book]
}
type Book {
    id: Int!,
    title: String!,
    cover: Image!,
    description: String!,
    author: Author
}
type User {
    id: Int!,
    name: String!,
    email: String!
    info: String!,
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
