const router = require("express").Router();
const Syllabus = require("../models/syllabus.model");

router.route("/add").post(async (req, res) => {
  const { code, startDate, endDate } = req.body;

  const newSyllabus = new Syllabus({ code, startDate, endDate });

  if (!code || code == null || !endDate || endDate == null || !startDate || startDate == null) {
    res.json({ "status": false, "result": 'Not all fields have been entered!' });
    return;
  }

  const syllabusExist = await Syllabus.findOne({ code: code });

  if (syllabusExist) {
    res.json({ "status": false, "result": 'Code is already used' });
  }
  if (newSyllabus) {
    newSyllabus.save().then(() =>
      res.json({ "status": true, "result": 'New syllabus added successfully!' })
    );
  } else {
    res.json({ "status": false, "result": 'Not all fields have been entered!' });
  }
});

router.route("/find").post(async (req, res) => {
    const { code } = req.body;
    try{
      if(req.body==null){
        res.status(401)
        throw new Error("Invalid code");
      }
  
      syllabus = await Syllabus.find({
          code: code,
        });
  
        if(syllabus == null){
          res.status(201).json(null);
        }
  
        res.status(201).json(syllabus)
  
    }catch(Error){
      res.json(null)
    };
  })

  router.route("/findAll").post(async (req, res) => {
    try{

      const filter = {};
      const syllabus = await Syllabus.find(filter);
  
        if(syllabus == null){
          res.status(201).json(null);
        }
  
        res.status(201).json(syllabus)
  
    }catch(Error){
      res.json(null)
    };
  })

  router.route("/delete").post(async (req, res) => {
    
    const { code } = req.body;
    await Syllabus.findOneAndDelete({ code: code }).then(function(){
      console.log("Data deleted"); // Success
      res.status(200).json({ "status": true, "result": 'Delete successful!' })
    
    }).catch(function(error){
      console.log(error); // Failure
      res.status(201).json({ "status": false, "result": 'Delete unsuccessful!' })
    });
  })

router.route("/updateSyllabus").post(async (req, res) => {
  let { oldCode, code, startDate, endDate } = req.body;

  var lookup = { code: oldCode };
  var newvalues = {code: code, startDate: startDate, endDate: endDate };

  await Syllabus.findOneAndUpdate(lookup, newvalues).then(function(){
    console.log("Syllabus updated"); // Success
    res.status(200).json({ "status": true, "result": 'Update successful!' })
  
  }).catch(function(error){
    console.log(error); // Failure
    res.status(201).json({ "status": false, "result": 'Update unsuccessful!' })
  })
});

  
  

module.exports = router;

