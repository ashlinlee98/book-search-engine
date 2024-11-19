import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    # Define your query fields here
    me: User
  }

  type Mutation {
    # Define your mutation fields here
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookId: String!, authors: [String], description: String, title: String, image: String, link: String): User
    removeBook(bookId: String!): User
  }

  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Auth {
    token: String
    user: User
  }
`;

export default typeDefs;
