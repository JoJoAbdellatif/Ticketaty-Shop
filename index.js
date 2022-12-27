const express = require('express')
const { getDb, connectToDb } = require('./dbConnection/db')
const {corsHeaders} = require('./middlewares/cors');
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
app.get('/matches', corsHeaders ,(req, res) => {
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
  app.get('/matches/:id' , corsHeaders , (req, res) => {

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
      const {matchNumber,tickets} = req.body

      let err =''

      match = await db.collection('Matches').findOne({matchNumber: matchNumber})
      
      for(i=0; i<tickets.length;i++){
        const {category,quantity} = tickets[i]

        if(category == 1){
          if(match.availability.category1.pending === 0){
              err = "All tickets reserved"
              break
          }
          else{
            if(quantity > match.availability.category1.pending){
              err = "Too much tickets"
              break
            }
            else{
              newVal = match.availability.category1.pending - quantity
              db.collection('Matches').updateOne({matchNumber: matchNumber},{$set: {"availability.category1.pending":newVal}})
            }
          }

        }

      if(category == 2){
          if(match.availability.category2.pending === 0){
              err = "All tickets reserved"
              break
          }
          else{
            if(quantity > match.availability.category2.pending){
              err = "Too much tickets"
              break
            }
            else{
              newVal = match.availability.category2.pending - quantity
              db.collection('Matches').updateOne({matchNumber: matchNumber},{$set: {"availability.category2.pending":newVal}})
            }
          }

      }

      if(category == 3){
        if(match.availability.category3.pending === 0){
            err = "All tickets reserved"
            break
        }
        else{
          if(quantity > match.availability.category3.pending){
            err = "Too much tickets"
            break
          }
          else{
            newVal = match.availability.category3.pending - quantity
            db.collection('Matches').updateOne({matchNumber: matchNumber},{$set: {"availability.category3.pending":newVal}})

          }
        }

      }
    }

    if(err){
      res.status(403).json({err:err})
    }
    else{
      res.status(200).json({message:"Success"})
    }
       
  })

  //Reserve a ticket
  app.patch('/reserveMatch', async(req, res) => {
    const {matchNumber,tickets} = req.body

    let err =''

    match = await db.collection('Matches').findOne({matchNumber: matchNumber})

    for(i=0; i<tickets.length;i++){
      const {category,quantity} = tickets[i]

      if(category == 1){
        if(match.availability.category1.count === 0){
          err = "All tickets reserved"
          break
        }
        else{
          if(match.availability.category1.count < quantity){
            err = "Not enough tickets"
            break
          }
          else{
            if(match.availability.category1.count <= match.availability.category1.pending){
              err = "Sorry the ticket have to be pending first"
              break
            }
            else{
              newVal = match.availability.category1.count - quantity
              db.collection('Matches').updateOne({matchNumber: matchNumber},{$set: {"availability.category1.count":newVal}})
        
            }
          }
        }
      }
  
      if(category == 2){
        if(match.availability.category2.count === 0){
          err = "All tickets reserved"
          break
        }
        else{
          if(match.availability.category2.count < quantity){
            err = "Not enough tickets"
            break
          }
          else{
            if(match.availability.category2.count <= match.availability.category2.pending){
              err = "Sorry the ticket have to be pending first"
              break
            }
            else{
              newVal = match.availability.category2.count - quantity
              db.collection('Matches').updateOne({matchNumber: matchNumber},{$set: {"availability.category2.count":newVal}})
        
            }
          }
        }
      }
  
      if(category == 3){
        if(match.availability.category3.count === 0){
          err = "All tickets reserved"
          break
        }
        else{
          if(match.availability.category3.count < quantity){
            err = "Not enough tickets"
            break
          }
          else{
            if(match.availability.category3.count <= match.availability.category3.pending){
              err = "Sorry the ticket have to be pending first"
              break
            }
            else{
              newVal = match.availability.category3.count - quantity
              db.collection('Matches').updateOne({matchNumber: matchNumber},{$set: {"availability.category3.count":newVal}})
        
            }
          }
        }
      }
    }
    
    if(err){
      res.status(403).json({err:err})
    }
    else{
      res.status(200).json({message:"Success"})
    }
        
    
  })

  //Cancell a ticket
  app.patch('/cancellMatch', async(req, res) => {
    const {matchNumber,tickets} = req.body

    let err =''

    match = await db.collection('Matches').findOne({matchNumber: matchNumber})

    for(i=0; i<tickets.length;i++){

      const {category,quantity} = tickets[i]

      if(category == 1){
      
        if(match.availability.category1.count < match.availability.category1.pending + quantity){
          err = "Trying to cancel a non existing ticket"
        }
        else{
          newVal = match.availability.category1.pending + quantity
          db.collection('Matches').updateOne({matchNumber: matchNumber},{$set: {"availability.category1.pending":newVal}})
  
        }
        
      }
  
      if(category == 2){
        
        if(match.availability.category2.count < match.availability.category2.pending + quantity){
          err = "Trying to cancel a non existing ticket"
        }
        else{
          newVal = match.availability.category2.pending + quantity
          db.collection('Matches').updateOne({matchNumber: matchNumber},{$set: {"availability.category2.pending":newVal}})
  
        }
        
      }
  
      if(category == 3){
        
        if(match.availability.category3.count < match.availability.category3.pending + quantity){
          err = "Trying to cancel a non existing ticket"
        }
        else{
          newVal = match.availability.category3.pending + quantity
          db.collection('Matches').updateOne({matchNumber: matchNumber},{$set: {"availability.category3.pending":newVal}})
        }
        
      }
    }
    
    if(err){
      res.status(403).json({err:err})
    }
    else{
      res.status(200).json({message:"Success"})
    }

            
  })

  //Get match by name

  app.get('/search/:team'  , corsHeaders , (req, res) => {
  
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

  
