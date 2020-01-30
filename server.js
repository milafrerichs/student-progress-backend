const { ApolloServer } = require('apollo-server-lambda');

const { schema } = require('./src/schema.js')
const { resolvers } = require('./src/resolvers.js')

const server = new ApolloServer({ typeDefs: schema, resolvers })

exports.handler = server.createHandler({
  cors: {
    origin: "*", // for security in production, lock this to your real endpoints
    credentials: true,
  },
})
