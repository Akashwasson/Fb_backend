const mongoose = require('mongoose');

const friendschema= mongoose.Schema({
   email: {type: String},
   posts:[{type: mongoose.Schema.Types.ObjectId, ref:'Post'}]
});

const frndpost = module.exports = mongoose.model("Friendspost",friendschema);

module.exports.addposts = function(data, callback){
    var query = {_id:data.id};
    frndpost.findOneAndUpdate(query, {$push: {posts:data.postid
    }},{ upsert: true , new : true}, callback); 

}

module.exports.removepost = function(data, callback){
    var query1 = {"_id": data.postid};
   var query = {_id: data.Id};
   frndpost.findOneAndUpdate(query,{$pullAll:{posts:[query1]}},callback)
   // .populate({path:'friendsid', populate:{path:'profilepic'}}) 
  
}