//Here, we are requiring express and cors to be used. 
//const port process.env.port will access the port variable from the config.env we required.

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//Heroku Requirement UNCOMMENT line below

//const path = require('path');

require("dotenv").config({ path: "./config.env" });

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

//Heroku requirements UNCOMMENT FOR HEROKU DEPLOY

// Serve static files from the public directory
//app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file for all other requests
//app.get('*', (req, res) => {
  //res.sendFile(path.join(__dirname, 'public/index.html'));
//});

//End Heroku requirements

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});
connection.once("disconnected", () => {
  console.log('Mongoose connection disconnected. Retrying in 5 seconds...');

  setTimeout(() => {
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }, 5000);
});

const usersRouter = require("./routes/users");
const syllabusRouter = require("./routes/syllabus");
const eventRouter = require("./routes/event");
const requestRouter = require("./routes/request");
const crewPositionRouter = require("./routes/crewPosition");
const notificationRouter = require("./routes/notification");


app.use("/users", usersRouter);
app.use("/syllabus", syllabusRouter);
app.use("/event", eventRouter);
app.use("/request",requestRouter);
app.use("/crewPosition",crewPositionRouter);
app.use("/notification",notificationRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
