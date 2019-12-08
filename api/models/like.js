var mongoose = require('mongoose');
var Post = require('../models/post');

var likeschema = mongoose.Schema({
    // likes : {type:String, default:""},
    userid: [{type: mongoose.Schema.Types.ObjectId, ref: 'Userdata'}],
    postid:{type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
});

const Like = module.exports = mongoose.model('Like',likeschema);

module.exports.addlikes = function(data, callback){
   var query = {_id: data.postid};
   
   var datad = new Like ({
    userid: data.userid,
    postid: data.postid
  }) 

     Post.findOneAndUpdate(query,{$push:{likes:data.userid}},callback);
}

module.exports.getuserids = function (data, callback){
    var query = {postid: data.postid};     
    Like.find(query, callback);
}

module.exports.deluserlike = function(data, callback){
    var query = {_id: data.postid};
    var query1 = {postid: data.postid};
     Post.findOneAndUpdate(query,{$pullAll:{"likes":data.userid}}, callback);
}