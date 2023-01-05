const express = require("express");
const { getDb, connectToDb } = require("./dbConnection/db");
const { corsHeaders } = require("./middlewares/cors");
const { ObjectId } = require("mongodb");
const axios = require("axios");
const flagUrl = 'https://ticketaty-shop.vercel.app/flag/'


const app = express();
app.use(express.json());

// db connection
let db;

connectToDb((err) => {
  if (!err) {
    app.listen("3000", () => {
      console.log("app listening on port 3000");
    });
    db = getDb();
  }
});

// Get 10 matches per page
app.get("/matches", corsHeaders, async (req, res) => {
  // current page
  const page = req.query.p || 0;
  const matchesPerPage = 7;

  let matches = [];

  db.collection("Matches")
    .find()
    .skip(page * matchesPerPage)
    .limit(matchesPerPage)
    .forEach(async (match) => matches.push(match))
    .then(async () => {
      for (let i = 0; i < matches.length; i++) {
        const homeTeamFlag = await axios.get(flagUrl + matches[i].homeTeam)
        const awayTeamFlag = await axios.get(flagUrl + matches[i].awayTeam)

        matches[i].homeTeamFlag = homeTeamFlag.data
        matches[i].awayTeamFlag = awayTeamFlag.data
      }

      res.status(200).json(matches);
    })
    .catch(() => {
      res.status(500).json({ error: "Could not fetch the matches" });
    });
});

// Get match by id
app.get("/matches/:id", corsHeaders, (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("Matches")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then(async (doc) => {
        const homeTeamFlag = await axios.get(flagUrl + doc.homeTeam)
        const awayTeamFlag = await axios.get(flagUrl + doc.awayTeam)

        doc.homeTeamFlag = homeTeamFlag.data
        doc.awayTeamFlag = awayTeamFlag.data

        res.status(200).json(doc);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not fetch the matches" });
      });
  } else {
    res.status(500).json({ error: "Could not fetch the matches" });
  }
});

//Pending a ticket
app.patch("/pendingMatch", async (req, res) => {
  const { matchNumber, tickets } = req.body;
  const { category, quantity } = tickets;

  match = await db.collection("Matches").findOne({ matchNumber: matchNumber });

  if (category == 1) {
    if (
      match.availability.category1.pending ===
      match.availability.category1.available
    ) {
      res.status(500).json({ message: "All tickets pending" });
    } else {
      if (quantity > match.availability.category1.available) {
        res.status(500).json({ message: "Too much tickets" });
      } else {
        newVal = match.availability.category1.pending + quantity;
        db.collection("Matches").updateOne(
          { matchNumber: matchNumber },
          { $set: { "availability.category1.pending": newVal } }
        );
        match = await db
          .collection("Matches")
          .findOne({ matchNumber: matchNumber });

        res.status(200).json(match);
      }
    }
  }

  if (category == 2) {
    if (
      match.availability.category2.pending ===
      match.availability.category2.available
    ) {
      res.status(500).json({ message: "All tickets pending" });
    } else {
      if (quantity > match.availability.category1.available) {
        res.status(500).json({ message: "Too much tickets" });
      } else {
        newVal = match.availability.category2.pending + quantity;
        db.collection("Matches").updateOne(
          { matchNumber: matchNumber },
          { $set: { "availability.category2.pending": newVal } }
        );
        match = await db
          .collection("Matches")
          .findOne({ matchNumber: matchNumber });

        res.status(200).json(match);
      }
    }
  }

  if (category == 3) {
    if (
      match.availability.category3.pending ===
      match.availability.category3.available
    ) {
      res.status(500).json({ message: "All tickets pending" });
    } else {
      if (quantity > match.availability.category1.available) {
        res.status(500).json({ message: "Too much tickets" });
      } else {
        newVal = match.availability.category3.pending + quantity;
        db.collection("Matches").updateOne(
          { matchNumber: matchNumber },
          { $set: { "availability.category3.pending": newVal } }
        );
        match = await db
          .collection("Matches")
          .findOne({ matchNumber: matchNumber });

        res.status(200).json(match);
      }
    }
  }
});

//Reserve a ticket
app.patch("/reserveMatch", async (req, res) => {
  const { matchNumber, tickets } = req.body;
  const { category, quantity } = tickets;

  match = await db.collection("Matches").findOne({ matchNumber: matchNumber });

  if (category == 1) {
    if (match.availability.category1.available === 0) {
      res.status(500).json({ message: "All tickets reserved" });
    } else {
      if (match.availability.category1.available < quantity) {
        res.status(500).json({ message: "Not enough tickets" });
      } else {
        if (match.availability.category1.pending === 0) {
          res.status(500).json({ message: "Pend a ticket first" });

        }
        else {
          newValAvailable = match.availability.category1.available - quantity;
          newValPending = match.availability.category1.pending - quantity;

          db.collection("Matches").updateOne(
            { matchNumber: matchNumber },
            { $set: { "availability.category1.available": newValAvailable } }
          );

          db.collection("Matches").updateOne(
            { matchNumber: matchNumber },
            { $set: { "availability.category1.pending": newValPending } }
          );
          match = await db
            .collection("Matches")
            .findOne({ matchNumber: matchNumber });

          res.status(200).json(match);
        }

      }
    }
  }

  if (category == 2) {
    if (match.availability.category2.available === 0) {
      res.status(500).json({ message: "All tickets reserved" });
    } else {
      if (match.availability.category2.available < quantity) {
        res.status(500).json({ message: "Not enough tickets" });
      } else {
        if (match.availability.category1.pending === 0) {
          res.status(500).json({ message: "Pend a ticket first" });

        }
        else {
          newValAvailable = match.availability.category2.available - quantity;
          newValPending = match.availability.category2.pending - quantity;

          db.collection("Matches").updateOne(
            { matchNumber: matchNumber },
            { $set: { "availability.category2.available": newValAvailable } }
          );

          db.collection("Matches").updateOne(
            { matchNumber: matchNumber },
            { $set: { "availability.category2.pending": newValPending } }
          );
          match = await db
            .collection("Matches")
            .findOne({ matchNumber: matchNumber });

          res.status(200).json(match);
        }

      }
    }
  }

  if (category == 3) {
    if (match.availability.category3.available === 0) {
      res.status(500).json({ message: "All tickets reserved" });
    } else {
      if (match.availability.category3.available < quantity) {
        res.status(500).json({ message: "Not enough tickets" });
      } else {
        if (match.availability.category3.pending === 0) {
          res.status(500).json({ message: "Pend a ticket first" });

        }
        else {
          newValAvailable = match.availability.category3.available - quantity;
          newValPending = match.availability.category3.pending - quantity;

          db.collection("Matches").updateOne(
            { matchNumber: matchNumber },
            { $set: { "availability.category3.available": newValAvailable } }
          );

          db.collection("Matches").updateOne(
            { matchNumber: matchNumber },
            { $set: { "availability.category3.pending": newValPending } }
          );
          match = await db
            .collection("Matches")
            .findOne({ matchNumber: matchNumber });

          res.status(200).json(match);
        }

      }
    }
  }

});

//Cancell a ticket
app.patch("/cancellMatch", async (req, res) => {
  const { matchNumber, tickets } = req.body;
  const { category, quantity } = tickets;

  match = await db.collection("Matches").findOne({ matchNumber: matchNumber });

  if (category == 1) {
    if (
      quantity > match.availability.category1.pending
    ) {
      res.status(500).json({ message: "Trying to cancel a non existing ticket" });
    } else {
      newVal = match.availability.category1.pending - quantity;
      db.collection("Matches").updateOne(
        { matchNumber: matchNumber },
        { $set: { "availability.category1.pending": newVal } }
      );
      match = await db
        .collection("Matches")
        .findOne({ matchNumber: matchNumber });

      res.status(200).json(match);
    }
  }
  if (category == 2) {
    if (
      quantity > match.availability.category2.pending
    ) {
      res.status(500).json({ message: "Trying to cancel a non existing ticket" });
    } else {
      newVal = match.availability.category2.pending - quantity;
      db.collection("Matches").updateOne(
        { matchNumber: matchNumber },
        { $set: { "availability.category2.pending": newVal } }
      );
      match = await db
        .collection("Matches")
        .findOne({ matchNumber: matchNumber });

      res.status(200).json(match);
    }
  }
  if (category == 3) {
    if (
      quantity > match.availability.category1.pending
    ) {
      res.status(500).json({ message: "Trying to cancel a non existing ticket" });
    } else {
      newVal = match.availability.category3.pending - quantity;
      db.collection("Matches").updateOne(
        { matchNumber: matchNumber },
        { $set: { "availability.category3.pending": newVal } }
      );
      match = await db
        .collection("Matches")
        .findOne({ matchNumber: matchNumber });

      res.status(200).json(match);
    }
  }

});


//Get match by name
app.get("/search/:team", corsHeaders, (req, res) => {
  const team = req.params.team;
  const regex = new RegExp(team, "i");

  let matches = [];

  db.collection("Matches")
    .find({ $or: [{ awayTeam: regex }, { homeTeam: regex }] })
    .forEach(async (match) => matches.push(match))
    .then(async () => {
      for (let i = 0; i < matches.length; i++) {
        const homeTeamFlag = await axios.get(flagUrl + matches[i].homeTeam)
        const awayTeamFlag = await axios.get(flagUrl + matches[i].awayTeam)

        matches[i].homeTeamFlag = homeTeamFlag.data
        matches[i].awayTeamFlag = awayTeamFlag.data
      }

      res.status(200).json(matches);
    })
});

//Get flag image
app.get("/flag/:team", (req, res) => {
  const team = req.params.team;
  db.collection("Flags")
    .findOne({ name: team })
    .then((doc) => {
      res.status(200).json(doc.flag);
    })
    .catch((err) => {
      db.collection('Flags')
        .findOne({ name: 'TBA' })
        .then((doc) => {
          res.status(200).json(doc.flag);
        })
        .catch((err) => {
          res.status(500).json({ error: "Could not fetch the flag" });
        })
    });
});

//add ticket
app.post("/ticket",(req,res)=>{
  const ticket = req.body

  db.collection('Tickets').insertOne(ticket, async function (error, response) {
    if(error) {
        console.log('Error occurred while inserting');
        res.status(400).json({error:"Error occurred while inserting"})

    } else {
      newTicket = await db.collection("Tickets").findOne({ _id: response.insertedId });
      res.status(200).json(newTicket);
    }
 });
})

//Get tickets by email
app.get("/ticket/:email", (req, res) => {
  const email = req.params.email;

  let tickets = [];

  db.collection("Tickets")
    .find({ email: email})
    .forEach((ticket) => tickets.push(ticket))
    .then(() => {
      res.status(200).json(tickets);
    })
    .catch((err) => {
      res.status(500).json({ error: "Could not fetch the tickets" });
    });
})

//add new match
app.post("/addMatch",(req,res)=>{
  const match = req.body

  db.collection('Matches').insertOne(match, async function (error, response) {
    if(error) {
        console.log('Error occurred while inserting');
        res.status(400).json({error:"Error occurred while inserting"})

    } else {
      newMatch = await db.collection("Matches").findOne({ _id: response.insertedId });
      res.status(200).json(newMatch);
    }
 });
})

// update analytics variables
app.patch('/analytics/:type',(req,res)=>{
  const type = req.params.type
  
  if(type == 'pending'){
    db.collection('Analytics').updateOne({_id: new ObjectId('63b434deb74edeb9e898f98f')},{$inc:{pending:1}})
    res.status(200).json({message:'pending updated'})
  }
  
  if(type == 'reserved'){
    db.collection('Analytics').updateOne({_id: new ObjectId('63b434deb74edeb9e898f98f')},{$inc:{reserved:1}})
    res.status(200).json({message:'reserved updated'})
  }
  if(type == 'canceled'){
    db.collection('Analytics').updateOne({_id: new ObjectId('63b434deb74edeb9e898f98f')},{$inc:{canceled:1}})
    res.status(200).json({message:'canceled updated'})
    }
  

})