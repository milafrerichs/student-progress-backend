const { uuid } = require('uuidv4')

const { get, update } = require('./db.js')

exports.resolvers = {
  Query: {
    // read an item from the database and return
    user: async (parent, args, context, info) => {
      const query = {
        TableName: process.env.USERS_TABLE,
        Key: { id: args.id }
      };
      const result = await get(query)
      return result.Item;
    },
  },
  Mutation: {
    // write item to the database
    createUser: async (parent, args, context, info) => {
      const id = uuid();
      const query = {
        TableName: process.env.USERS_TABLE,
        Key: { id },
        UpdateExpression: "SET auth0Id = :auth0Id",
        ExpressionAttributeValues: {
        ":auth0Id": args.auth0Id,

        },
        ReturnValues: "ALL_NEW",
      }
      let result = await update(query);
      return result.Attributes
    },
  },
}
