const mongoose = require('mongoose');

const postschema= mongoose.Schema({
   _id: {type: String},
   posts:[{type: mongoose.Schema.Types.ObjectId, ref:'Post'}]
});

const sharedpost = module.exports = mongoose.model("Sharedpost",postschema);


module.exports.addpost = function(data,callback){
    var query = {_id:data.id};
    sharedpost.findOneAndUpdate(query, {$push: {posts:data.postid
    }},{ upsert: true , new : true}, callback); 
}