const mongoose= require('mongoose')

const crewPositionSchema= mongoose.Schema({
    acronym: { type: String, required: true, unique: true, minlength: 1},
    fullName: {type: String, required: true}
},{
    timestamps:false,
});

const crewPosition = mongoose.model("crewPosition", crewPositionSchema);
module.exports = crewPosition;
