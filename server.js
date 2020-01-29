const { ApolloServer, gql  } = require('apollo-server-lambda');
const AWS = require('aws-sdk');
const { uuid } = require('uuidv4')

const dynamoDB = new AWS.DynamoDB.DocumentClient()

const getItem = async function(tableName, key) {
  const query = {
    TableName: tableName,
    Key: key
  };
  console.log(query)
  return new Promise((resolve, reject) => {
    dynamoDB.get(query, (err, result) => {
      if (err) {
        console.error(query, err)
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}
const updateItem = async function(query) {
  return new Promise((resolve, reject) => {
    dynamoDB.update(query, (err, result) => {
      if (err) {
        console.error(query, err)
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

// this is where we define the shape of our API
const schema = gql`
  type Item {
    itemId: String
    property1: String
    property2: String
  }
  type Query {
    item(itemId: String!): Item
  }
  type Mutation {
    createItem(property1: String, property2: String): Item
  }
`

// this is where the shape maps to functions
const resolvers = {
  Query: {
    // read an item from the database and return
    item: async (parent, args, context, info) => {
      const result = await getItem(process.env.ITEM_TABLE, { itemId: args.itemId })
      return result.Item;
    },
  },
  Mutation: {
    // write item to the database
    createItem: async (parent, args, context, info) => {
      const itemId = uuid();
      const query = {
        TableName: process.env.ITEM_TABLE,
        Key: { itemId  },
        UpdateExpression: "SET property1 = :property1, property2 = :property2",
        ExpressionAttributeValues: {
        ":property1": args.property1,
        ":property2": args.property2,

        },
        ReturnValues: "ALL_NEW",
      }
      let result = await updateItem(query);
      return result.Attributes
    },
  },
}

// Create a GraphQL server
const server = new ApolloServer({ typeDefs: schema, resolvers })

exports.handler = server.createHandler({
  cors: {
    origin: "*", // for security in production, lock this to your real endpoints
    credentials: true,
  },
})
