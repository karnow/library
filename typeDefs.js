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
    anything(id: ID!): Anything @ deprecated(reason: "No longer sapported. Use resource instead"),
    everything:[Anything!]! @ deprecated(reason: "No longer sapported. Use resources instead"),
    resource(id: ID!): Resource,
    resources:[Resource!]!,
    people:[Person!]!
}
type Mutation {
    borrowBookCopy(id: ID!): BookCopy!
    borrowRandomBook: BookCopy!
    returnBookCopy(id: ID!): BookCopy!
    createUser(name: String!, email: String!, info: String!): User
    updateUser(id: ID!, name: String!, info: String!): User
    deleteUser(id: ID!): ID
    createAuthor(name: String!, bio:String!):Author
    updateAuthor(id: ID!, name:String!, bio: String!): Author
    deleteAuthor(id: ID!): ID
    createBook(author_Id: ID!, title:String!, description:String!):Book
    updateBook(id: ID!, title: String!, description: String!):Book
    deleteBook(id: ID!): ID
}
union Anything = Author | Book | User | BookCopy

interface Resource {
    id: ID!
}

interface Person {
    name: String!
}


type Author implements Resource & Person {
    id: ID!,
    name: String!,
    photo: Image!,
    bio: String!,
    books: [Book]
}
type Book implements Resource {
    id: ID!,
    title: String!,
    cover: Image!,
    description: String!,
    author: Author,
    copies: [BookCopy!]!
}
type User implements Resource & Person {
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
type BookCopy implements Resource {
    id: ID!,
    owner: User!,
    book: Book!,
    borrower: User
}

`;

module.exports = typeDefs;
