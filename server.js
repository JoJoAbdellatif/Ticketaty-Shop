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

  //Pending a ticket
    app.patch('/pendingMatch', async(req, res) => { 
      const {matchNumber,ticket:{category,quantity}} = req.body
  
      match = await db.collection('Matches').findOne({matchNumber: matchNumber})
  
  
      if(category == 1){
          if(match.availability.category1.pending === 0){
              res.status(403).json({err:"All tickets reserved"})
          }
          else{
            if(quantity > match.availability.category1.pending){
              res.status(403).json({err:"Too much tickets"}) 
            }
            else{
              newVal = match.availability.category1.pending - quantity
              db.collection('Matches').updateOne({matchNumber: matchNumber},{$set: {"availability.category1.pending":newVal}})

              match = await db.collection('Matches').findOne({matchNumber: matchNumber})
              res.json(match)
            }
          }

      }

      if(category == 2){
        if(match.availability.category2.pending === 0){
            res.status(403).json({err:"All tickets reserved"})
        }
        else{
          if(quantity > match.availability.category2.pending){
            res.status(403).json({err:"Too much tickets"}) 
          }
          else{
            newVal = match.availability.category2.pending - quantity
            db.collection('Matches').updateOne({matchNumber: matchNumber},{$set: {"availability.category2.pending":newVal}})

            match = await db.collection('Matches').findOne({matchNumber: matchNumber})
            res.json(match)
          }
        }

    }

    if(category == 3){
      if(match.availability.category3.pending === 0){
          res.status(403).json({err:"All tickets reserved"})
      }
      else{
        if(quantity > match.availability.category3.pending){
          res.status(403).json({err:"Too much tickets"}) 
        }
        else{
          newVal = match.availability.category3.pending - quantity
          db.collection('Matches').updateOne({matchNumber: matchNumber},{$set: {"availability.category3.pending":newVal}})

          match = await db.collection('Matches').findOne({matchNumber: matchNumber})
          res.json(match)
        }
      }

  }
      
      
    })

  //Reserve a ticket
  app.patch('/reserveMatch', async(req, res) => {
    const {matchNumber,ticket:{category,quantity}} = req.body

    match = await db.collection('Matches').findOne({matchNumber: matchNumber})

    

    if(category == 1){
      if(match.availability.category1.count === 0){
        res.status(403).json({err:"All tickets Sold"})
      }
      else{
        if(match.availability.category1.count < quantity){
          res.status(403).json({err:"Not enough tickets"})
        }
        else{
          if(match.availability.category1.count <= match.availability.category1.pending){
            res.status(403).json({err:"Sorry the ticket have to be pending first"})
          }
          else{
            newVal = match.availability.category1.count - quantity
            db.collection('Matches').updateOne({matchNumber: matchNumber},{$set: {"availability.category1.count":newVal}})
      
            match = await db.collection('Matches').findOne({matchNumber: matchNumber})
            res.json(match)
          }
        }
      }
    }

    if(category == 2){
      if(match.availability.category2.count === 0){
        res.status(403).json({err:"All tickets Sold"})
      }
      else{
        if(match.availability.category2.count < quantity){
          res.status(403).json({err:"Not enough tickets"})
        }
        else{
          if(match.availability.category2.count <= match.availability.category2.pending){
            res.status(403).json({err:"Sorry the ticket have to be pending first"})
          }
          else{
            newVal = match.availability.category2.count - quantity
            db.collection('Matches').updateOne({matchNumber: matchNumber},{$set: {"availability.category2.count":newVal}})
      
            match = await db.collection('Matches').findOne({matchNumber: matchNumber})
            res.json(match)
          }
        }
      }
    }

    if(category == 3){
      if(match.availability.category3.count === 0){
        res.status(403).json({err:"All tickets Sold"})
      }
      else{
        if(match.availability.category3.count < quantity){
          res.status(403).json({err:"Not enough tickets"})
        }
        else{
          if(match.availability.category3.count <= match.availability.category3.pending){
            res.status(403).json({err:"Sorry the ticket have to be pending first"})
          }
          else{
            newVal = match.availability.category3.count - quantity
            db.collection('Matches').updateOne({matchNumber: matchNumber},{$set: {"availability.category3.count":newVal}})
      
            match = await db.collection('Matches').findOne({matchNumber: matchNumber})
            res.json(match)
          }
        }
      }
    }
        
    
  })

  //Cancell a ticket
  app.patch('/cancelledMatch', async(req, res) => {
    const {matchNumber,ticket:{category,quantity}} = req.body

    match = await db.collection('Matches').findOne({matchNumber: matchNumber})

    

    if(category == 1){
      
      if(match.availability.category1.count < match.availability.category1.pending + quantity){
        res.status(403).json({err:"Trying to cancel a non existing ticket"})
      }
      else{
        newVal = match.availability.category1.pending + quantity
        db.collection('Matches').updateOne({matchNumber: matchNumber},{$set: {"availability.category1.pending":newVal}})

        match = await db.collection('Matches').findOne({matchNumber: matchNumber})
        res.json(match)
      }
      
    }

    if(category == 2){
      
      if(match.availability.category2.count < match.availability.category2.pending + quantity){
        res.status(403).json({err:"Trying to cancel a non existing ticket"})
      }
      else{
        newVal = match.availability.category2.pending + quantity
        db.collection('Matches').updateOne({matchNumber: matchNumber},{$set: {"availability.category2.pending":newVal}})

        match = await db.collection('Matches').findOne({matchNumber: matchNumber})
        res.json(match)
      }
      
    }

    if(category == 3){
      
      if(match.availability.category3.count < match.availability.category3.pending + quantity){
        res.status(403).json({err:"Trying to cancel a non existing ticket"})
      }
      else{
        newVal = match.availability.category3.pending + quantity
        db.collection('Matches').updateOne({matchNumber: matchNumber},{$set: {"availability.category3.pending":newVal}})

        match = await db.collection('Matches').findOne({matchNumber: matchNumber})
        res.json(match)
      }
      
    }

            
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

  
