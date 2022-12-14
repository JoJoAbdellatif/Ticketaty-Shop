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


  app.get('/matches/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
  
      db.collection('Matches')
        .findOne({_id: new ObjectId(req.params.id)})
        .then(doc => {
          res.status(200).json(doc)
        })
        .catch(err => {
          res.status(500).json({error: 'Could not fetch the matches'})
        })
        
    } else {
      res.status(500).json({error: 'Could not fetch the matches'})
    }
  
  })

  app.patch('/reserveMatch', async(req, res) => {
    const {matchNumber,tickets:{catego1ry,quantity}} = req.body

    match = await db.collection('Matches')
    .findOne({matchNumber: matchNumber})
    .then(doc => {
        res.status(200).json(doc)
      })
    .catch(err => {
        res.status(500).json({error: 'Could not fetch the matches'})
      })
      
    
  })

  app.patch('/cancelledMatch', (req, res) => {
    const updates = req.body
    
    
  })