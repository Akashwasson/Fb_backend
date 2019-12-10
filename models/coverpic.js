const mongoose = require('mongoose');
const Userdata = require('../models/userdata');

const basicdata = mongoose.Schema({  
    _id: mongoose.Schema.Types.ObjectId,
    userid:{ type: mongoose.Schema.Types.ObjectId, ref: 'Userdata'},
    coverpic: {type: String,default: "finalcover.jpg"},
    Post:  { type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
});

module.exports = mongoose.model('Coverpic', basicdata);

module.exports.emptyarray = function (data,callback){
    let query = {_id:data.userid};
   //  let query1 = {userid: data.userid};

   Userdata.findOneAndUpdate(query,{$set:{coverpic:[]}},{upsert:true, new: true },callback)
}