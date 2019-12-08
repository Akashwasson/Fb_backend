const mongoose = require('mongoose')

const friendlist = mongoose.Schema({
    email:  {type: String},
    _id: {type : String},
    friendsid: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Userdata' }],
})

var friendlists = module.exports = mongoose.model('Friendlist', friendlist);

module.exports.findbyemail = function(data, callback){
    var query = {email: data.email};
    friendlists.findOne(query,callback).populate({path:'friendsid', populate:{path:'profilepic'}}) 
    .then(doc=>{
        if(doc){
            //  console.log("success")
        }
    })
    .catch(err=>{
        error:err
     })
}

module.exports.removefriend = function(data, callback){
     var query1 = {"_id": data.friendid};
    var query = {email: data.email};
    friendlists.findOneAndUpdate(query,{$pullAll:{friendsid:[query1]}},callback)
    
}