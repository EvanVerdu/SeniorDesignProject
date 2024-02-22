const router = require("express").Router();
const Event = require("../models/event.model");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

router.route("/add").post(async (req, res) => {
  const { title, name, startDate, endDate, startTime, endTime, description, type, syllabus, instructors, students} = req.body;

  const newEvent = new Event({ title, name, startDate, endDate, startTime, endTime, description, type, syllabus, instructors, students });

    if (newEvent) {
      newEvent.save().then(() =>
        res.status(200).json({ "status": true, "result": 'Creation successful!' })
      );
    } else {
        res.status(400).json({ "status": false, "result": 'Creation unsuccessful!' })
    }
});

  router.route("/findAll").post(async (req, res) => {
    try{

      const filter = {};
      const event = await Event.find(filter);
  
        if(event == null){
          res.status(201).json(null);
        }
  
        res.status(201).json(event)
  
    }catch(Error){
      res.json(null)
    };
  })

  router.route("/findAllOrdered").post(async (req, res) => {
    try{

      const filter = {};
      const events = await Event.find(filter).sort({ startDate: -1 });
  
        if(events == null){
          res.status(201).json(null);
        }
  
        res.status(201).json(events)
  
    }catch(Error){
      res.json(null)
    };
  })

  //N stands for name
router.route("/findN").post(async (req, res) => {
  const { name } = req.body;
  try{
    if(req.body==null){
      res.status(401)
      throw new Error("Invalid name");
    }

    let eventArray = await Event.find({
        name: name,
      });

      if(eventArray == null){
        res.status(201).json(null);
      }
      res.status(201).json(eventArray)

  }catch(Error){
    res.json(null)
  };
})

router.route("/delete").post(async (req, res) => {
    
  const { id } = req.body;
  await Event.findOneAndDelete({ _id: new ObjectId(id) }).then(function(){
    console.log("Data deleted"); // Success
    res.status(200).json({ "status": true, "result": 'Delete successful!' })
  
  }).catch(function(error){
    console.log(error); // Failure
    res.status(201).json({ "status": false, "result": 'Delete unsuccessful!' })
  });
})

router.route("/findID").post(async (req, res) => {
  const { id } = req.body;
  try{
    if(req.body==null){
      res.status(401)
      throw new Error("Invalid id");
    }

    let eventArray = await Event.find({
        _id: new ObjectId(id),
      });

      if(eventArray == null){
        res.status(201).json(null);
      }
      res.status(201).json(eventArray)

  }catch(Error){
    res.json(null)
  };
})

router.route("/findStuEmail").post(async (req, res) => {
  const { email } = req.body;
  try{
    if(req.body==null){
      res.status(401)
      throw new Error("Invalid id");
    }

    let eventArray = await Event.find({
        "students.email": email
      });

      if(eventArray == null){
        res.status(201).json(null);
      }
      res.status(201).json(eventArray)

  }catch(Error){
    res.json(null)
  };
})

router.route("/findInstEmail").post(async (req, res) => {
  const { email } = req.body;
  try{
    if(req.body==null){
      res.status(401)
      throw new Error("Invalid id");
    }

    let eventArray = await Event.find({
        "instructors.email": email
      });

      if(eventArray == null){
        res.status(201).json(null);
      }
      res.status(201).json(eventArray)

  }catch(Error){
    res.json(null)
  };
})


router.route("/updateEvent").post(async (req, res) => {
  const { id, title, name, startDate, endDate, startTime, endTime, description, type, syllabus} = req.body;

  var lookup = { _id: new ObjectId(id) };
  var newvalues = {title: title, name: name, startDate: startDate, endDate: endDate, startTime: startTime, endTime: endTime, description: description, type: type, syllabus: syllabus };

  await Event.findOneAndUpdate(lookup, newvalues).then(function(){
    console.log("Event updated"); // Success
    res.status(200).json({ "status": true, "result": 'Update successful!' })
  
  }).catch(function(error){
    console.log(error); // Failure
    res.status(201).json({ "status": false, "result": 'Update unsuccessful!' })
  })
});

router.route("/updateAttendingStudents").post(async (req, res) => {
  const { eventId, attendingArray} = req.body;

  var lookup = { _id: new ObjectId(eventId) };
  var newvalues = {students: attendingArray };

  await Event.findOneAndUpdate(lookup, newvalues).then(function(){
    console.log("Event updated"); // Success
    res.status(200).json({ "status": true, "result": 'Update successful!' })
  
  }).catch(function(error){
    console.log(error); // Failure
    res.status(201).json({ "status": false, "result": 'Update unsuccessful!' })
  })
});

router.route("/updateConflicts").post(async (req, res) => {
  const { eventId, conflictArray } = req.body;

  var lookup = { _id: new ObjectId(eventId) };
  var newvalues = {conflicts: conflictArray };

  await Event.findOneAndUpdate(lookup, newvalues).then(function(){
    console.log("Conflict updated"); // Success
    res.status(200).json({ "status": true, "result": 'Update successful!' })
  
  }).catch(function(error){
    console.log(error); // Failure
    res.status(201).json({ "status": false, "result": 'Update unsuccessful!' })
  })
});

router.route("/deleteUserUpdateAttendanceStu").post(async (req, res) => {
  const emails = req.body;

  try {
    await Event.updateMany(
      { 'students.email': { $in: emails } },
      { $pull: { students: { email: { $in: emails } } } }
    );

    console.log("Update successful");
    res.status(200).json({ status: true, result: 'Update successful!' });
  } catch (error) {
    console.error(error);
    res.status(201).json({ status: false, result: 'Update unsuccessful!' });
  }
});


router.route("/deleteUserUpdateAttendanceInst").post(async (req, res) => {
  const emails = req.body;

  try {
    await Event.updateMany(
      { 'instructors.email': { $in: emails } },
      { $pull: { instructors: { email: { $in: emails } } } }
    );

    console.log("Update successful");
    res.status(200).json({ status: true, result: 'Update successful!' });
  } catch (error) {
    console.error(error);
    res.status(201).json({ status: false, result: 'Update unsuccessful!' });
  }
});


router.route("/clearConflicts").post(async (req, res) => {

  var newvalues = {conflicts: []};

  await Event.updateMany(newvalues).then(function(){
    console.log("Conflicts cleared"); // Success
    res.status(200).json({ "status": true, "result": 'Update successful!' })
  
  }).catch(function(error){
    console.log(error); // Failure
    res.status(201).json({ "status": false, "result": 'Update unsuccessful!' })
  })
});

router.route("/findConflictsByUser").post(async (req, res) => {
  const { email } = req.body;

  console.log(email)

  var lookup = { "conflicts.email": email };

  try {
    const conflictedEvents = await Event.find(lookup);
    console.log("Conflicted events returned", conflictedEvents);
    res.status(200).json({ "status": true, "result": 'Successful!', "conflictedEvents": conflictedEvents });
  } catch (error) {
    console.log(error);
    res.status(201).json({ "status": false, "result": 'Unsuccessful!' });
  }
});

router.route("/clearConflicts").post(async (req, res) => {

  var newvalues = {conflicts: []};

  await Event.updateMany(newvalues).then(function(){
    console.log("Conflicts cleared"); // Success
    res.status(200).json({ "status": true, "result": 'Update successful!' })
  
  }).catch(function(error){
    console.log(error); // Failure
    res.status(201).json({ "status": false, "result": 'Update unsuccessful!' })
  })
});

router.route("/deleteALL").post(async (req, res) => {

  const filter = {};

  try {
    const de = await Event.deleteMany(filter);
    console.log("Events Deleted", de);
    res.status(200).json({ "status": true, "result": 'Successful!' });
  } catch (error) {
    console.log(error);
    res.status(201).json({ "status": false, "result": 'Unsuccessful!' });
  }
});

router.route("/updateAttendingInstructors").post(async (req, res) => {
  const { eventId, attendingArray} = req.body;

  var lookup = { _id: new ObjectId(eventId) };
  var newvalues = {instructors: attendingArray };

  await Event.findOneAndUpdate(lookup, newvalues).then(function(){
    console.log("Event updated"); // Success
    res.status(200).json({ "status": true, "result": 'Update successful!' })
  
  }).catch(function(error){
    console.log(error); // Failure
    res.status(201).json({ "status": false, "result": 'Update unsuccessful!' })
  })
});

//When a syllabus is updated, associated events will update as well to reflect the change
router.route("/updateCertainSyllabusNew").post(async (req, res) => {
  let { syllabus, newSyllabus } = req.body;
  var lookup = { syllabus: syllabus };
  var newvalues = {syllabus: newSyllabus };

  await Event.updateMany(lookup, newvalues).then(function(){
    console.log("Data updated"); // Success
    res.status(200).json({ "status": true, "result": 'Update successful!' })
    
  }).catch(function(error){
    console.log(error); // Failure
    res.status(201).json({ "status": false, "result": 'Update unsuccessful!' })
  })
});

router.route("/updateCertainNameNewInst").post(async (req, res) => {
  const { email, newName } = req.body;
  try {
    await Event.updateMany(
      { "instructors.email": email },
      { $set: { "instructors.$.name": newName } }
    );

    console.log("Data updated"); // Success
    res.status(200).json({ status: true, result: 'Update successful!' });
  } catch (error) {
    console.log(error); // Failure
    res.status(201).json({ status: false, result: 'Update unsuccessful!' });
  }
});

router.route("/updateCertainNameNewStu").post(async (req, res) => {
  let { email, newName } = req.body;
  var lookup = { 'students.email': email };
  var newvalues = {'students.$.name': newName };

  await Event.updateMany(lookup, newvalues).then(function(){
    console.log("Data updated"); // Success
    res.status(200).json({ "status": true, "result": 'Update successful!' })
    
  }).catch(function(error){
    console.log(error); // Failure
    res.status(201).json({ "status": false, "result": 'Update unsuccessful!' })
  })
});



module.exports = router;

