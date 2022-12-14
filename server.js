const express = require('express')
const { getDb, connectToDb } = require('./dbConnection/db')
const { ObjectId } = require('mongodb')

const app = express()
app.use(express.json())


// db connection
let db

connectToDb((err) => {
  if(!err){
    app.listen('3000', () => {
      console.log('app listening on port 3000')
    })
    db = getDb()
  }
})


app.get('/matches', (req, res) => {
    // current page
    const page = req.query.p || 0
    const matchesPerPage = 10
    
    let matches = []
  
    db.collection('Matches')
      .find()
      .skip(page * matchesPerPage)
      .limit(matchesPerPage)
      .forEach(match => matches.push(match))
      .then(() => {
        res.status(200).json(matches)
      })
      .catch(() => {
        res.status(500).json({error: 'Could not fetch the matches'})
      })
  })