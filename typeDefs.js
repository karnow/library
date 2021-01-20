const { gql } = require("apollo-server");

const typeDefs = gql`
schema {
    query: Query 
   
}
type Query {
    books(searchQuery: String! = ""): [Book!]!
    authors(searchQuery: String! = ""): [Author!]!,
    users(searchQuery: String! = ""): [User!]!,
    book(id: ID!): Book,
    author(id: ID!): Author,
    user(id: ID!): User,
    anything(id: ID!): Anything,
    everything:[Anything!]!
}

union Anything = Author | Book | User


type Author {
    id: ID!,
    name: String!,
    photo: Image!,
    bio: String!,
    books: [Book]
}
type Book {
    id: ID!,
    title: String!,
    cover: Image!,
    description: String!,
    author: Author
}
type User {
    id: ID!,
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
