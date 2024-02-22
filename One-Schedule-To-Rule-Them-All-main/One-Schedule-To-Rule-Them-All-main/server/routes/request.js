const router = require("express").Router();
const Request = require("../models/request.model");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

//adds a request
router.route("/add").post(async (req, res) => { 
    const requestingUser = req.body.requestingUser;
    const userType = req.body.userType;
    const name = req.body.name;
    const dateRequested = Date.parse(req.body.dateRequested);
    const dateRequestedEnd = Date.parse(req.body.dateRequestedEnd);
    const description   = req.body.description;
    const accepted = Number(0);
    const approvingUser = "N/A";
    const reason = "N/A";  
    const seenNotification = 0; 

    //for newly created requests: accepted should be 0 (meaning pending), approving User should be "N/A"(hasnt been approved yet), reason should be null or ""(not approved), and seenNotification should be 0 "Not seen yet" 
    const newRequest = new Request({ requestingUser, userType, name, dateRequested, dateRequestedEnd, description, accepted, approvingUser, reason, seenNotification}); 

    try {
        if (newRequest)  
        {
            res.status(201);
            newRequest.save().then(() =>
            res.json("New request created successfully!")
      );
        }
        else
        {
            res.status(400);
            throw new Error("request error");
        }
    }
    catch (Error)
    {
        res.json(Error.message);
    }
});

//Updates request to reflect a changed name
router.route("/updateNameRequest").post(async (req, res) => {
  const { email, firstName, lastName} = req.body;
  let newName = (lastName + ", " + firstName);

  var lookup = { requestingUser: email };
  var newvalues = {name: newName };

  await Request.updateMany(lookup, newvalues).then(function(){
    console.log("Request updated"); // Success
    res.status(200).json({ "status": true, "result": 'Update successful!' })
  
  }).catch(function(error){
    console.log(error); // Failure
    res.status(201).json({ "status": false, "result": 'Update unsuccessful!' })
  })
});


//Updates request to reflect a changed name
router.route("/updateRequestUserDelete").post(async (req, res) => {
  const emails = req.body;

  try {
    await Request.deleteMany(
      { 'requestingUser': { $in: emails } }
    );

    console.log("Update successful");
    res.status(200).json({ status: true, result: 'Delete successful!' });
  } catch (error) {
    console.error(error);
    res.status(201).json({ status: false, result: 'Delete unsuccessful!' });
  }
});

//gets all requests
router.route("/findAll").post(async (req, res) => { 
    try{

        const request = await Request.find().sort({ updatedAt: 'asc'});
    
          if(request == null){
            res.status(201).json(null);
          }
    
          res.status(201).json(request)
    
      }catch(Error){
        res.json(null)
      };
    });

//gets pending requests
router.route("/findPending").post(async (req, res) => {
    try{

        const filter = {accepted: 0};
        const request = await Request.find(filter).sort({ updatedAt: 'asc'});
    
          if(request == null){
            res.status(201).json(null);
          }
    
          res.status(201).json(request)
    
      }catch(Error){
        res.json(null)
      };
    });

  //E stands for Email (personal)
  router.route("/findApprovedRequestE").post(async (req, res) => {
    let requestingUser = req.body.email;
    try{
        const filter = {accepted: 1, requestingUser: requestingUser};
        const request = await Request.find(filter).sort({ updatedAt: 'asc'});
    
          if(request == null){
            res.status(201).json(null);
          }
    
          res.status(201).json(request)
    
      }catch(Error){
        res.json(null)
      };
    });

  router.route("/findPendingRequestE").post(async (req, res) => {
    let requestingUser = req.body.email;
    try{
        const filter = {accepted: {$in: [0]}, requestingUser: requestingUser};
        const request = await Request.find(filter).sort({ updatedAt: 'asc'});
    
          if(request == null){
            res.status(201).json(null);
          }
    
          res.status(201).json(request)
    
      }catch(Error){
        res.json(null)
      };
    });






  router.route("/findProcessedRequestE").post(async (req, res) => {
    let requestingUser = req.body.email;
    try{
        const filter = {accepted: {$in: [1,2]}, requestingUser: requestingUser};
        const request = await Request.find(filter).sort({ updatedAt: 'asc'});
    
          if(request == null){
            res.status(201).json(null);
          }
    
          res.status(201).json(request)
    
      }catch(Error){
        res.json(null)
      };
    });
    //S stands for students
    router.route("/findPendingRequestS").post(async (req, res) => {
      try{
          const filter = {accepted: {$in: [0]}, userType: "student"};
          const request = await Request.find(filter).sort({ updatedAt: 'asc'});
      
            if(request == null){
              res.status(201).json(null);
            }
      
            res.status(201).json(request)
      
        }catch(Error){
          res.json(null)
        };
      });

    router.route("/findProcessedRequestS").post(async (req, res) => {
      try{
          const filter = {accepted: {$in: [1,2]}, userType: "student"};
          const request = await Request.find(filter).sort({ updatedAt: 'asc'});
      
            if(request == null){
              res.status(201).json(null);
            }
      
            res.status(201).json(request)
      
        }catch(Error){
          res.json(null)
        };
      });

      //F stands for faculty
      router.route("/findPendingRequestF").post(async (req, res) => {
        try{
            const filter = {accepted: {$in: [0]}, userType: "faculty"};
            const request = await Request.find(filter).sort({ updatedAt: 'asc'});
        
              if(request == null){
                res.status(201).json(null);
              }
        
              res.status(201).json(request)
        
          }catch(Error){
            res.json(null)
          };
        });
  
      router.route("/findProcessedRequestF").post(async (req, res) => {
        try{
            const filter = {accepted: {$in: [1,2]}, userType: "faculty"};
            const request = await Request.find(filter).sort({ updatedAt: 'asc'});
        
              if(request == null){
                res.status(201).json(null);
              }
        
              res.status(201).json(request)
        
          }catch(Error){
            res.json(null)
          };
        });


    //gets completed requests
router.route("/findCompleted").post(async (req, res) => {
  try{

      const filter = {accepted: {$in: [1,2]}};
      const request = await Request.find(filter).sort({ updatedAt: 'asc'});
  
        if(request == null){
          res.status(201).json(null);
        }
  
        res.status(201).json(request)
  
    }catch(Error){
      res.json(null)
    };
  });

  //find request
  router.route('/findS/:id').post(async (req, res) =>{ 
    try{
      const request = await Request.findById(req.params.id)
  
        if(request == null){
          res.status(204).json(null);
        }
  
        res.status(202).json(request)
  
    }catch(Error){
      res.json(null)
    };
  });
    //delete request
    router.route("/delete/:id").post(async (req, res) => {

      Request.findByIdAndDelete(req.params.id)
      .then(()=>res.json("REQUEST DELETED"))
      .catch(err=> res.status(400).json('Error: '+err));

    });

    //delete ALL REQUESTS
    router.route("/deleteAll/").post(async (req, res) => {

      Request.deleteMany({})
      .then(()=>res.json("ALL REQUESTS DELETED"))
      .catch(err=> res.status(400).json('Error: '+err));

    });

    //approve request

    router.route('/accept/:id').post((req, res) =>{
        Request.findById(req.params.id)
            .then(request =>{
                request.accepted = 1;
                request.approvingUser = req.body.approvingUser;
                request.reason = req.body.reason;
                request.seenNotification = 0;

                request.save()
                    .then(() => res.json("Request ACCEPTED!"))
                    .catch(err => res.status(400).json("Error: "+ err));
            })
            .catch(err => res.status(400).json("Error: " + err));


    });

    //refuserequest
    router.route('/decline/:id').post((req, res) =>{
        Request.findById(req.params.id)
            .then(request =>{
                request.accepted = 2;
                request.approvingUser = req.body.approvingUser;
                request.reason = req.body.reason;
                request.seenNotification = 0;

                request.save()
                    .then(() => res.json("Request DECLINED!"))
                    .catch(err => res.status(400).json("Error: "+ err));
            })
            .catch(err => res.status(400).json("Error: " + err));
    });

    router.route('/numPending').post(async (req, res) =>{ 
      try{
        let requestingUser = req.body.email;

        const filter = {accepted: 0,requestingUser: requestingUser};
        const request = await Request.find(filter).countDocuments();
    
          if(request == null){
            res.status(201).json(null);
          }
    
          res.status(201).json(request)
    
      }catch(Error){
        res.json(null)
      };
    });


module.exports = router;