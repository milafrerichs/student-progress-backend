const { gql  } = require('apollo-server-lambda');
exports.schema = gql`
  type User {
    id: ID!
    auth0Id: String!
    savedStates: [Save]
  }
  type Save {
    id: ID!
    code: String
    userId: ID!
  }
  type Query {
    user(id: String!): User
    userByAuth0(auth0Id: String!): User
  }
  type Mutation {
    createUser(auth0Id: String!): User
    createSave(code: String, userId: ID!): Save
  }
`
