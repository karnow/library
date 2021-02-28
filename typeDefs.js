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
    createUser(input: CreateUserInput): UserMutationResult
    updateUser(input: UpdateUserInput): UserMutationResult
    deleteUser(id: ID!): DeleteUserMutationResult
    createAuthor(name: String!, bio:String!):AuthorMutationResult
    updateAuthor(id: ID!, name:String!, bio: String!): AuthorMutationResult
    deleteAuthor(id: ID!): DeleteAuthorMutationResult
    createBook(author_Id: ID!, title:String!, description:String!):BookMutationResult
    updateBook(id: ID!, title: String!, description: String!):BookMutationResult
    deleteBook(id: ID!): DeleteBookMutationResult
    createBookCopy(owner_Id:ID!, book_Id:ID!, borrower_Id:ID!):BookCopyMutationResult
    updateBookCopy(id: ID!, owner_Id:ID!, book_Id:ID!, borrower_Id:ID! ):BookCopyMutationResult
    deleteBookCopy(id: ID!): DeleteBookCopyMutationResult
    resetData: ResetMutationResult
}
union Anything = Author | Book | User | BookCopy
 
interface MutationResult {
    success: Boolean!
    message: String!
}
input CreateUserInput {
    name: String!
    email: String!
    info: String!
}
input UpdateUserInput {
    id: ID!
    name: String!
    info: String!
}

type BookCopyMutationResult implements MutationResult{
    success: Boolean!
    message: String!
    bookcopy: BookCopy
}
type DeleteBookCopyMutationResult implements MutationResult{
    success: Boolean!
    message: String!
    id: ID
}
type BookMutationResult implements MutationResult{
    success: Boolean!
    message: String!
    book: Book
}
type DeleteBookMutationResult implements MutationResult{
    success: Boolean!
    message: String!
    id: ID
}
type AuthorMutationResult implements MutationResult{
    success: Boolean!
    message: String!
    author: Author
}
type DeleteAuthorMutationResult implements MutationResult{
    success: Boolean!
    message: String!
    id: ID
}
type UserMutationResult implements MutationResult{
    success: Boolean!
    message: String!
    user: User
}
type DeleteUserMutationResult implements MutationResult{
    success: Boolean!
    message: String!
    id: ID
}
type ResetMutationResult implements MutationResult{
    success: Boolean!
    message: String!
}

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
