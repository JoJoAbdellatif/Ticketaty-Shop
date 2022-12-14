const { MongoClient } = require('mongodb')
require('dotenv').config();

let dbConnection

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect()
      .then(client => {
        dbConnection = client.db(process.env.DBCONNECTION)
        return cb()
      })
      .catch(err => {
        console.log(err)
        return cb(err)
      })
  },
  getDb: () => dbConnection
}