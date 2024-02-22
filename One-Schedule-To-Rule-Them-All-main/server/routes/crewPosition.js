const router = require("express").Router();
const CrewPosition = require("../models/crewPosition.model");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

router.route("/add").post(async (req, res) => {
  const { acronym, fullName } = req.body;

  const newCP = new CrewPosition({ acronym, fullName });

  if (!acronym || acronym == null) {
    res.status(400).json({ "status": false, "result": 'Not all fields entered!' })
    return;
  }
  if (!fullName || fullName == null) {
    res.status(400).json({ "status": false, "result": 'Not all fields entered!' })
    return;
  }

  const cpExist = await CrewPosition.findOne({ acronym: acronym });

  try {
    if (cpExist) {
      res.status(400).json({ "status": false, "result": 'Acronym is already used!' })
      return;
    }
    if (newCP) {
      newCP.save().then(() =>
        res.status(200).json({ "status": true, "result": 'Creation successful!' })
      );
    } else {
      res.status(400).json({ "status": false, "result": 'crew position DNE' })
    }
  } catch (Error) {
    res.status(400).json({ "status": false, "result": 'Error' })
  }
});

  router.route("/findAll").post(async (req, res) => {
    try{
      const filter = {};
      const cp = await CrewPosition.find(filter);
  
        if(cp == null){
          res.status(201).json(null);
        }
  
        res.status(201).json(cp)
  
    }catch(Error){
      res.json(null)
    };
  })

  router.route("/delete").post(async (req, res) => {
    
    const { id } = req.body;
    await CrewPosition.findOneAndDelete({ _id: new ObjectId(id) }).then(function(){
      console.log("Data deleted"); // Success
      res.status(200).json({ "status": true, "result": 'Delete successful!' })
    
    }).catch(function(error){
      console.log(error); // Failure
      res.status(201).json({ "status": false, "result": 'Delete unsuccessful!' })
    });
  })

router.route("/update").post(async (req, res) => {
  let { id, acronym, fullName } = req.body;

  var lookup = { _id: new ObjectId(id) };
  var newvalues = { acronym: acronym, fullName: fullName };

  await CrewPosition.findOneAndUpdate(lookup, newvalues).then(function(){
    console.log("Crew Position updated"); // Success
    res.status(200).json({ "status": true, "result": 'Update successful!' })
  
  }).catch(function(error){
    console.log(error); // Failure
    res.status(201).json({ "status": false, "result": 'Update unsuccessful!' })
  })
});

router.route("/findID").post(async (req, res) => {
    const { id } = req.body;
    try{
      if(req.body==null){
        res.status(401)
        throw new Error("Invalid id");
      }
  
      let crewPositionArray = await CrewPosition.findOne({
          _id: new ObjectId(id),
        });
  
        if(crewPositionArray == null){
          res.status(201).json(null);
        }
        res.status(201).json(crewPositionArray)
  
    }catch(Error){
      res.json(null)
    };
  })

  router.route("/findAcronym").post(async (req, res) => {
    const { acronym } = req.body;
    try{
      if(req.body==null){
        res.status(401)
        throw new Error("Invalid acronym");
      }
  
      let crewPositionArray = await CrewPosition.findOne({
          acronym: acronym
        });
  
        if(crewPositionArray == null){
          res.status(201).json(null);
        }
        res.status(201).json(crewPositionArray)
  
    }catch(Error){
      //res.json(null)
    };
  })

module.exports = router;

