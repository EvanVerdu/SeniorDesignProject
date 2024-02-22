const router = require("express").Router();
const Notification = require("../models/notification.model");
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;


router.route("/add").post(async (req, res) => {
    const { recipient, subject, message } = req.body;
  
    const newNotif = new Notification({ recipient,subject, message });
  
    if (!recipient || recipient == null) {
      res.status(400);
      throw new Error("All fields not entered");
    }
    if (!message || message == null) {
      res.status(400);
      throw new Error("All fields not entered");
    }
  
    try {
      if (newNotif) {
        res.status(201);
        newNotif.save().then(() =>
          res.json("New notification added successfully!")
        );
      } else {
        res.status(400);
        throw new Error("notification DNE");
      }
    } catch (Error) {
      res.json(Error.message);
    }
  });

  router.route("/addGeneric").post(async (req, res) => {
    const { recipient, subject, message, recipientType } = req.body;
  
    const newNotif = new Notification({ recipient, subject, message, recipientType });
  
    if (!recipient || recipient == null) {
      res.status(400);
      throw new Error("All fields not entered");
    }
    if (!message || message == null) {
      res.status(400);
      throw new Error("All fields not entered");
    }
  
    try {
      if (newNotif) {
        res.status(201);
        newNotif.save().then(() =>
          res.json("New notification added successfully!")
        );
      } else {
        res.status(400);
        throw new Error("notification DNE");
      }
    } catch (Error) {
      res.json(Error.message);
    }
  });


router.route("/findE").post(async (req, res) => {
  const { recipient } = req.body;
  try{
    if(req.body==null){
      res.status(401)
      throw new Error("Invalid email");
    }

    notification = await Notification.find({
        recipient: recipient
      });

      if(notification == null){
        res.status(201).json(null);
      }

      res.status(201).json(notification)

  }catch(Error){
    res.json(null)
  };
})

//RT stands for Recipient Type
router.route("/findRT").post(async (req, res) => {
  const { recipientType } = req.body;
  try{
    if(req.body==null){
      res.status(401)
      throw new Error("Invalid type");
    }

    notification = await Notification.find({
        recipientType: recipientType
      });

      if(notification == null){
        res.status(201).json(null);
      }

      res.status(201).json(notification)

  }catch(Error){
    res.json(null)
  };
})

router.route("/findAll").post(async (req, res) => {
    try{
      const filter = {};
      const notif = await Notification.find(filter);
  
        if(notif == null){
          res.status(201).json(null);
        }
  
        res.status(201).json(notif)
  
    }catch(Error){
      res.json(null)
    };
  })

  router.route("/findID").post(async (req, res) => {
    const { id } = req.body;
    try{
      if(req.body==null){
        res.status(401)
        throw new Error("Invalid id");
      }
  
      let notifArray = await Notification.find({
          _id: new ObjectId(id),
        });
  
        if(notifArray == null){
          res.status(201).json(null);
        }
        res.status(201).json(notifArray)
  
    }catch(Error){
      res.json(null)
    };
  })

  router.route("/delete").post(async (req, res) => {
    
    const { id } = req.body;
    await Notification.findOneAndDelete({ _id: new ObjectId(id) }).then(function(){
      console.log("Data deleted"); // Success
      res.status(200).json({ "status": true, "result": 'Delete successful!' })
    
    }).catch(function(error){
      console.log(error); // Failure
      res.status(201).json({ "status": false, "result": 'Delete unsuccessful!' })
    });
  })

  //C stands for Combined (RT and email in one query)
router.route("/findC").post(async (req, res) => {
  const { recipientType ,recipientType2, recipient} = req.body;
  try{
    if(req.body==null){
      res.status(401)
      throw new Error("Invalid type"); 
    }

    notification = await Notification.find({
        $or:[{recipientType: [recipientType,recipientType2]},
          {recipient: recipient}]
      }).sort({ createdAt: 'desc'});

      if(notification == null){
        res.status(201).json(null);
      }

      res.status(201).json(notification)

  }catch(Error){
    res.json(null)
  };
})




module.exports = router;