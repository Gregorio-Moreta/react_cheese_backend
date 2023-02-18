///////////////////////////////////
// Dependencies
///////////////////////////////////
// dotenv to get our env variables
require("dotenv").config({ debug: true })
// PULL PORT variable from .env
const {PORT = 3000, MONGODB_URI} = process.env
// import express
const express = require("express")
// create app object
const app = express()
// import mongoose
const mongoose = require("mongoose")
// import middleware
const cors = require("cors"); // cors headers
const morgan = require("morgan") // logging

//////////////////////////////////
// Database Connection
//////////////////////////////////
// Establish Connection
mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

// Connection Events
mongoose.connection
.on("open", () => console.log("Connected to Mongo"))
.on("close", () => console.log("Disonnected to Mongo"))
.on("error", (error) => console.log(error))

////////////////////////////////////////////////
// Models
////////////////////////////////////////////////
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
})

const Cheese = mongoose.model("Cheese", CheeseSchema)

////////////////////////////////////////////////////
// Middleware
///////////////////////////////////////////////////
app.use(cors()) // prevent cors errors
app.use(morgan("dev")) // logging
app.use(express.json()) // parse json bodies

////////////////////////////////
// Routes and Routers
///////////////////////////////
// test route
app.get("/", (req, res) => {
    res.send("hello world")
})
// Index Route - get request to /people
// get us all the peoples
app.get("/cheese", async (req, res) => {
    try {
        // send all the peoples
        res.json(await Cheese.find({}))
    } catch (error) {
        // send error
        res.status(400).json({error})
    }
})
// Create Route - post request to /people
// create a person from JSON body
app.post("/cheese", async (req, res) => {
    try {
        // create a new people
        res.json(await Cheese.create(req.body))
    } catch (error){
        //send error
        res.status(400).json({error})
    }
})
// update route - put request to /cheese/:id
// update a specified cheese
app.put("/cheese/:id", async (req, res) => {
    try {
        res.json(
            await Cheese.findByIdAndUpdate(req.params.id, req.body, {new: true})
        )
    } catch (error){
        res.status(400).json({error})
    }
})
// destroy route - delete request to /people/:id
// delete a specific people
app.delete("/cheese/:id", async (req, res) => {
    try {
      res.json(await Cheese.findByIdAndRemove(req.params.id));
    } catch (error) {
      res.status(400).json({ error });
    }
  });
///////////////////////////////
//Server listener
////////////////////////////////
app.listen(PORT, () => {
    console.log(`listening on PORT ${PORT}`)
})