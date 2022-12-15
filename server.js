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

// Get 10 matches per page
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

// Get match by id
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

  //Reserve a ticket
  app.patch('/reserveMatch', async(req, res) => {
    const {matchNumber,ticket:{category,quantity}} = req.body

    match = await db.collection('Matches').findOne({matchNumber: matchNumber})

    

    if(category == 1){
        newVal = match.availability.category1.count - quantity
        db.collection('Matches').updateOne({matchNumber: matchNumber},{$set: {"availability.category1.count":newVal}})
    }
    if(category == 2){
        newVal = match.availability.category2.count - quantity
        db.collection('Matches').updateOne({matchNumber: matchNumber},{$set: {"availability.category2.count":newVal}})
    }
    if(category == 3){
        newVal = match.availability.category3.count - quantity
        db.collection('Matches').updateOne({matchNumber: matchNumber},{$set: {"availability.category3.count":newVal}})
    }
        
    res.json(match)
    
  })

  //Cancell a ticket
  app.patch('/cancelledMatch', async(req, res) => {
    const {matchNumber,ticket:{category,quantity}} = req.body

    match = await db.collection('Matches').findOne({matchNumber: matchNumber})

    

    if(category == 1){
        newVal = match.availability.category1.count + quantity
        db.collection('Matches').updateOne({matchNumber: matchNumber},{$set: {"availability.category1.count":newVal}})
    }
    if(category == 2){
        newVal = match.availability.category2.count + quantity
        db.collection('Matches').updateOne({matchNumber: matchNumber},{$set: {"availability.category2.count":newVal}})
    }
    if(category == 3){
        newVal = match.availability.category3.count + quantity
        db.collection('Matches').updateOne({matchNumber: matchNumber},{$set: {"availability.category3.count":newVal}})
    }
        
    res.status(200).json(match)
    
  })

  //Get match by name

  app.get('/search/:team', (req, res) => {
  
    const team = req.params.team
    const regex = new RegExp(team, 'i') 

    let matches = []
  
    db.collection('Matches')
      .find({$or:[{awayTeam: regex}, {homeTeam: regex}]})
      .forEach(match => matches.push(match))
      .then(() => {
        res.status(200).json(matches)
      })
      .catch(() => {
        res.status(500).json({error: 'Could not fetch the matches'})
      })
  })

  
