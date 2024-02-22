const mongoose= require('mongoose')

const userSchema= mongoose.Schema({
    email: { type: String, required: true, unique: true, minlength: 3},
    password: {type: String, required: true},
    userType: {type: String, required: true},
    firstName: {type: String, required: false},
    lastName: {type: String, required: false},
    syllabus: {type: String, required: false},
    crewPosition: {type: String, required: false}
},{
    timestamps:true,
});

const user=mongoose.model("user", userSchema);
module.exports= user;
