let AWS = require('aws-sdk');

let dynamoDB = new AWS.DynamoDB.DocumentClient()

let get = async function(query) {
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
let update = async function(query) {
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
exports.update = update,
exports.get = get
