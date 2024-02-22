const mongoose= require('mongoose')

const notificationSchema = mongoose.Schema({
    recipient: { type: String, required: true },
    message: {type: String, required: true}, 
    subject: {type: String},
    recipientType: {type: String}
},{
    timestamps:true,
});

const notification = mongoose.model("notification", notificationSchema);
module.exports = notification;