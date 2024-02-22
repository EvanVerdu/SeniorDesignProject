const mongoose= require('mongoose')

const syllabusSchema = mongoose.Schema({
    code: {type: String, required: true, unique: true},
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
},{
    timestamps:true,
});

const syllabus=mongoose.model("syllabus", syllabusSchema);
module.exports= syllabus;