const mongoose= require('mongoose')

const requestSchema = mongoose.Schema({
    requestingUser: { type: String, required: true, minlength: 3}, //user who sent in the request
    userType:       { type: String, required: true, minlength: 3},
    name:           { type: String, required: true}, //for display purposes
    //dateCreated: { type: Date, required: true }, //date the request was created (cataloging purposes) DEPRECIATED DUE TO TIMESTAMPS
    dateRequested: { type: Date, required: true }, //date the user wants off, can be multiple
    dateRequestedEnd: { type: Date, required: true }, //date the user wants off, can be multiple
    description: {type: String, required: true,  maxlength: 150}, //small blurb of why
    accepted: {type: Number, required: true}, //accepted meaning 0 for in progress, 1 for accepted, 2 for denied
    approvingUser: { type: String, required: true}, //will be "N/A" until successfully updated with the approval or denial
    reason: {type: String,  maxlength: 150}, //reason to approve or deny, not necessarily needed
    seenNotification: {type: Number, required: true} //0 for checked, 1 for already seen 
    
},{
    timestamps:true,
});

const request = mongoose.model("request", requestSchema); 
module.exports = request;