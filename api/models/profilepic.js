const mongoose = require('mongoose');
const Userdata = require('../models/userdata');
 
const basicdata = mongoose.Schema({  
    _id: mongoose.Schema.Types.ObjectId,
    userid:{ type: mongoose.Schema.Types.ObjectId, ref: 'Userdata'},
    profilepic: {type: String, default: "face.jpg"},
    Post:  { type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
});

const profilepicschema =module.exports = mongoose.model('Profilepic', basicdata);

module.exports.addprofilepic = function (data,callback){
       let query = {userid:data.userid};
       let datad = {
             profilepic: data.profilepic
       }
       
     profilepicschema.findOneAndUpdate(query,datad,{upsert:false, new: false },callback)
}