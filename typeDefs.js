const { gql } = require("apollo-server");

const typeDefs = gql`
schema {
    query: Query 
    mutation: Mutation
   
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
type Mutation {
    borrowBookCopy(id: ID!): BookCopy!
}
union Anything = Author | Book | User | BookCopy


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
    author: Author,
    copies: [BookCopy!]!
}
type User {
    id: ID!,
    name: String!,
    email: String!
    info: String!,
    avatar:Avatar!,
    ownedBookCopies: [BookCopy!]!
    borrowedBookCopies: [BookCopy!]!

}
type Image {
    url:String!
}
type Avatar {
    image: Image!,
    color: String!
}
type BookCopy {
    id: ID!,
    owner: User!,
    book: Book!,
    borrower: User
}

`;

module.exports = typeDefs;
