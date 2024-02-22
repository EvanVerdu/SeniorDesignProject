const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const middleware=require("../middleware/authMiddleware");

 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

router.route("/logIn").post(async (req, res) => {
  const { email, password } = req.body;
    if (!email || email == null) {
      res.json({ "status": false, "result": 'Not all fields have been entered!' });
      return;
    }
    const userExist = await User.findOne({
      email: email,
      password: password,
    });
    if (userExist) {
      res.json(
        createToken({
          email: email,
          password: password,
        })
      );
    } else {
      res.json({ "status": false, "result": 'Email or password is incorrect' });
    }
});

router.route("/add").post(async (req, res) => {
  const { email, password, userType, firstName, lastName, syllabus, crewPosition } = req.body;
  const newUser = new User({ email, password, userType, firstName, lastName, syllabus, crewPosition });

  if (!email || email == null) {
    res.json({ "status": false, "result": 'Not all fields have been entered!' });
    return;
  }

  const userExist = await User.findOne({ email: email });
  try {
    if (userExist) {
      res.json({ "status": false, "result": 'That email is already used!' });
      return;
    }
    if (newUser) {
      newUser.save().then(() =>
      res.json({ "status": true, "result": 'Registration Complete!' })
      );
    } else {
      res.json({ "status": true, "result": 'Not all fields have been entered!' });
    }
  } catch (Error) {
    res.json(Error.message);
  }
});


router.route("/updateName").post(async (req, res) => {
  let { email, firstName, lastName } = req.body;

  var lookup = { email: email };
  var newvalues = {firstName: firstName, lastName: lastName };

  

  await User.findOneAndUpdate(lookup, newvalues).then(function(){
    console.log("Data updated"); // Success
    res.status(200).json({ "status": true, "result": 'Update successful!' })
  
  }).catch(function(error){
    console.log(error); // Failure
    res.status(201).json({ "status": false, "result": 'Update unsuccessful!' })
  })
});

router.route("/updatePassword").post(async (req, res) => {
  let { email, password } = req.body;

  var lookup = { email: email };
  var newvalues = {password: password };

  await User.findOneAndUpdate(lookup, newvalues).then(function(){
    console.log("Data updated"); // Success
    res.status(200).json({ "status": true, "result": 'Update successful!' })

  }).catch(function(error){
    console.log(error); // Failure
    res.status(201).json({ "status": false, "result": 'Update unsuccessful!' })
  })
});

router.route("/updateCrewPosition").post(async (req, res) => {
  let { email, crewPosition } = req.body;
  var lookup = { email: email };
  var newvalues = {crewPosition: crewPosition };

  await User.findOneAndUpdate(lookup, newvalues).then(function(){
    console.log("Data updated"); // Success
    res.status(200).json({ "status": true, "result": 'Update successful!' })
    
  }).catch(function(error){
    console.log(error); // Failure
    res.status(201).json({ "status": false, "result": 'Update unsuccessful!' })
  })
});

router.route("/updateUserType").post(async (req, res) => {
  let { email, userType } = req.body;
  var lookup = { email: email };
  var newvalues = {userType: userType };

  await User.findOneAndUpdate(lookup, newvalues).then(function(){
    console.log("Data updated"); // Success
    res.status(200).json({ "status": true, "result": 'Update successful!' })
    
  }).catch(function(error){
    console.log(error); // Failure
    res.status(201).json({ "status": false, "result": 'Update unsuccessful!' })
  })
});

router.route("/updateCertainSyllabus").post(async (req, res) => {
  let { syllabus } = req.body;
  var lookup = { syllabus: syllabus };
  var newvalues = {syllabus: null };

  await User.updateMany(lookup, newvalues).then(function(){
    console.log("Data updated"); // Success
    res.status(200).json({ "status": true, "result": 'Update successful!' })
    
  }).catch(function(error){
    console.log(error); // Failure
    res.status(201).json({ "status": false, "result": 'Update unsuccessful!' })
  })
});

router.route("/updateCertainSyllabusNew").post(async (req, res) => {
  let { syllabus, newSyllabus } = req.body;
  var lookup = { syllabus: syllabus };
  var newvalues = {syllabus: newSyllabus };

  await User.updateMany(lookup, newvalues).then(function(){
    console.log("Data updated"); // Success
    res.status(200).json({ "status": true, "result": 'Update successful!' })
    
  }).catch(function(error){
    console.log(error); // Failure
    res.status(201).json({ "status": false, "result": 'Update unsuccessful!' })
  })
});

router.route("/updateCertainCPNew").post(async (req, res) => {
  let { crewPosition, newCrewPosition } = req.body;
  var lookup = { crewPosition: crewPosition };
  var newvalues = {crewPosition: newCrewPosition };

  await User.updateMany(lookup, newvalues).then(function(){
    console.log("Data updated"); // Success
    res.status(200).json({ "status": true, "result": 'Update successful!' })
    
  }).catch(function(error){
    console.log(error); // Failure
    res.status(201).json({ "status": false, "result": 'Update unsuccessful!' })
  })
});

router.route("/updateSyllabus").post(async (req, res) => {
  let { email, syllabus } = req.body;
  var lookup = { email: email };
  var newvalues = {syllabus: syllabus };

  await User.findOneAndUpdate(lookup, newvalues).then(function(){
    console.log("Data updated"); // Success
    res.status(200).json({ "status": true, "result": 'Update successful!' })
    
  }).catch(function(error){
    console.log(error); // Failure
    res.status(201).json({ "status": false, "result": 'Update unsuccessful!' })
  });
});

router.route("/get").post(async (req, res) => {
  const email =  await middleware.isValidToken(req.body.token);
  try{
    if(email == null){
      res.status(401)
      throw new Error("Invalid email");
    }

    user = await User.find({
        email: email
      });

      if(user == null){
        res.status(201).json(null);
      }
      res.status(201).json(user)

  }catch(Error){
    res.json(null)
  };
})

//EP stands for email and password
router.route("/findEP").post(async (req, res) => {
  const { email, password } = req.body;
  try{
    if(req.body==null){
      res.status(401)
      throw new Error("Invalid email");
    }

    user = await User.find({
        email: email,
        password: password
      });

      if(user == null){
        res.status(201).json(null);
      }

      res.status(201).json(user)

  }catch(Error){
    res.json(null)
  };
})

//E stands for email
router.route("/findE").post(async (req, res) => {
  const { email } = req.body;
  try{
    if(req.body==null){
      res.status(401)
      throw new Error("Invalid email");
    }

    user = await User.find({
        email: email,
      });

      if(user == null){
        res.status(201).json(null);
      }

      res.status(201).json(user)

  }catch(Error){
    res.json(null)
  };
})

//N stands for Last Name
router.route("/findLN").post(async (req, res) => {
  const { lastName } = req.body;
  try{
    if(req.body==null){
      res.status(401)
      throw new Error("Invalid lastName");
    }

    user = await User.find({
        lastName: lastName,
      });

      if(user == null){
        res.status(201).json(null);
      }
      res.status(201).json(user)

  }catch(Error){
    res.json(null)
  };
})

//FN stands for First Name
router.route("/findFN").post(async (req, res) => {
  const { firstName } = req.body;
  try{
    if(req.body==null){
      res.status(401)
      throw new Error("Invalid first name");
    }

    user = await User.find({
        firstName: firstName,
      });

      if(user == null){
        res.status(201).json(null);
      }
      res.status(201).json(user)

  }catch(Error){
    res.json(null)
  };
})

//CP stands for Crew Position
router.route("/findCP").post(async (req, res) => {
  const { crewPosition } = req.body;
  try{
    if(req.body==null){
      res.status(401)
      throw new Error("Invalid crew position");
    }

    user = await User.find({
        crewPosition: crewPosition,
      });

      if(user == null){
        res.status(201).json(null);
      }
      res.status(201).json(user)

  }catch(Error){
    res.json(null)
  };
})

//S stands for Syllabus
router.route("/findS").post(async (req, res) => {
  const { syllabus } = req.body;
  try{
    if(req.body==null){
      res.status(401)
      throw new Error("Invalid syllabus");
    }

    user = await User.find({
        syllabus: syllabus,
      });

      if(user == null){
        res.status(201).json(null);
      }
      res.status(201).json(user)

  }catch(Error){
    res.json(null)
  };
})

//UT stands for user type
router.route("/findUT").post(async (req, res) => {
  const { userType } = req.body;
  try{
    if(req.body==null){
      res.status(401)
      throw new Error("Invalid user type");
    }

    user = await User.find({
        userType: userType,
      });

      if(user == null){
        res.status(201).json(null);
      }
      res.status(201).json(user)

  }catch(Error){
    res.json(null)
  };
})

router.route("/findAll").post(async (req, res) => {
  try{

    const filter = {};
    const user = await User.find(filter);

      if(user == null){
        res.status(201).json(null);
      }

      res.status(201).json(user)

  }catch(Error){
    res.json(null)
  };
})

router.route("/updateUserType").post(async (req, res) => {
  let { email, userType } = req.body;
  var lookup = { email: email };
  var newvalues = {userType: userType };

  await User.findOneAndUpdate(lookup, newvalues).then(function(){
    console.log("Data updated"); // Success
    res.status(200).json({ "status": true, "result": 'Update successful!' })
    
  }).catch(function(error){
    console.log(error); // Failure
    res.status(201).json({ "status": false, "result": 'Update unsuccessful!' })
  })
});

router.route("/delete").post(async (req, res) => {
  const { email } = req.body;
  try{   
    await User.deleteOne( {email:email} ).then(function(){
      console.log("Data deleted"); // Success
      res.status(200).json({ "status": true, "result": 'Delete successful!' })
      
    }).catch(function(error){
      console.log(error); // Failure
      res.status(201).json({ "status": false, "result": 'Delete Error!' })
    })
  }catch(Error){
    res.json(null)
  };
})

router.route("/deleteMany").post(async (req, res) => {
  const array = req.body;
  try {
    const result = await User.deleteMany({ email: { $in: array } });
    console.log(result.deletedCount + " documents deleted.");
    res.status(201).json("Success");
  } catch (err) {
    console.log(err);
    res.status(400).json("Failed");
  }
})

const createToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET);
};
module.exports = router;

