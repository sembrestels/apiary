const { MongoClient } = require('mongodb')
const assert = require('assert')

module.exports = function setupDb () {
  return new Promise((resolve) => {
    // Create a new MongoClient
    const client = new MongoClient(
      process.env.MONGODB_URI || 'mongodb://localhost:27017'
    )

    // Use connect method to connect to the Server
    client.connect((err) => {
      assert.strictEqual(null, err)
      resolve(client.db(process.env.MONGODB_NAME || 'daolist'))
    })
  })
}
