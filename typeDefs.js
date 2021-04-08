const { gql } = require("apollo-server");

const typeDefs = gql`
schema {
    query: Query 
    mutation: Mutation
   
}
type Query {
    books(searchQuery: String! = "", limit: Int, offset: Int = 0, pageSize: Int, pageNumber: Int = 1): PaginatedBooks!
    authors(searchQuery: String! = ""): [Author!]!,
    users(searchQuery: String! = ""): [User!]!,
    book(id: ID!): Book,
    author(id: ID!): Author,
    user(id: ID!): User,
    anything(id: ID!): Anything @ deprecated(reason: "No longer sapported. Use resource instead"),
    everything:[Anything!]! @ deprecated(reason: "No longer sapported. Use resources instead"),
    resource(id: ID!): Resource,
    resources:[Resource!]!,
    people:[Person!]!,
    currentUser: CurrentUser
}
type Mutation {
    borrowBookCopy(id: ID!): BookCopy!
    borrowRandomBook: BookCopy!
    returnBookCopy(id: ID!): BookCopy!
    createUser(input: CreateUserInput!): UserMutationResult!
    updateUser(input: UpdateUserInput!): UserMutationResult!
    deleteUser(id: ID!): DeleteUserMutationResult!
    createAuthor(input:CreateAuthorInput!):AuthorMutationResult!
    updateAuthor(input: UpdateAuthorInput!): AuthorMutationResult!
    deleteAuthor(id: ID!): DeleteAuthorMutationResult!
    createBook(input: CreateBookInput!):BookMutationResult!
    updateBook(input: UpdateBookInput!):BookMutationResult!
    deleteBook(id: ID!): DeleteBookMutationResult!
    createBookCopy(input: CreateBookCopyInput!):BookCopyMutationResult!
    updateBookCopy(input: UpdateBookCopyInput!):BookCopyMutationResult!
    deleteBookCopy(id: ID!): DeleteBookCopyMutationResult!
    logIn(input: LogInInput!): LogInResult!
    signUp(input: SignInInput):SignUpResult!
    resetData: ResetMutationResult!

}
union Anything = Author | Book | User | BookCopy
 
interface MutationResult {
    success: Boolean!
    message: String!
}
input SignInInput {
    name: String!
    email: String!
    password: String!
    info: String! = "I'll tell you more about me later..."
}
type SignUpResult implements MutationResult {
    success: Boolean!
    message: String!
    token: String!
    currentUser: CurrentUser
}
input LogInInput{
    email: String!
    password: String!
}

input UpdateBookCopyInput{
    id: ID!
    owner_Id:ID!
    book_Id:ID!
    borrower_Id:ID!
}
input CreateBookCopyInput {
    owner_Id:ID!
    book_Id:ID!
    borrower_Id:ID!
}
input UpdateBookInput {
    id: ID!
    title: String!
    description: String!

}
input CreateBookInput {
    author_Id: ID!
    title:String!
    description:String!
}
input UpdateAuthorInput {
    id: ID!
    name: String!
    bio: String!
}
input CreateAuthorInput {
    name: String!
    bio: String!
}
input CreateUserInput {
    name: String!
    email: String!
    info: String!
    password: String!
}
input UpdateUserInput {
    id: ID!
    name: String!
    info: String!
    password: String!
}
type LogInResult implements MutationResult {
    success: Boolean!
    message: String!
    token: String
    currentUser: CurrentUser
    
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
    passwordHash: String!
    info: String!,
    avatar:Avatar!,
    ownedBookCopies: [BookCopy!]!
    borrowedBookCopies: [BookCopy!]!

}
type CurrentUser implements Resource {
    id: ID!
    isAdmin: Boolean!
    name: String!
    email: String!
    info: String!
    avatar:Avatar!
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
type PageInfo {
    currentPageNumber: Int!
    nextPageNumber: Int
    previousPageNumber: Int
}
type PaginatedBooks {
    results: [Book!]!
    pageInfo: PageInfo!
}

`;

module.exports = typeDefs;
