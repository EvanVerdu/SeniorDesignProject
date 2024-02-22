const mongoose= require('mongoose')

const eventSchema = mongoose.Schema({
    title: {type: String, required: true},
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: {type: String, required: true },
    endTime: { type: String, required: true },
    description: { type: String },
    type: {type: String, required: true },
    syllabus: {type: String },
    instructors: [
        {
            email: {type: String, required: true},
            name: { type: String }
        }
    ],
    students: [
        {
            email: {type: String, required: true},
            name: { type: String }
        }
    ],
    conflicts: [
        {
            message: { type: String },
            email: {type: String, required: true}
        }
    ]

},{
    timestamps:true,
});

const event=mongoose.model("event", eventSchema);
module.exports= event;