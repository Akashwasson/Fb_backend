const mongoose = require('mongoose');
 
const userdata = mongoose.Schema({  
    _id: mongoose.Schema.Types.ObjectId,
    username : {type: String, required : true},
    email: {type: String, required : true},
    profilepic: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profilepic' }],
    coverpic: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Coverpic' }],
    post:  { type: mongoose.Schema.Types.ObjectId, ref: 'Post'}  ,
    friendslist:  { type: mongoose.Schema.Types.ObjectId, ref: 'Friendlist'}  ,
    
});

module.exports = mongoose.model('Userdata', userdata);