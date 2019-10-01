const mongoose = require('mongoose')

const friendlist = mongoose.Schema({
    email:  {type: String},
    friendsid: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Userdata' }],
})

var friendlists = module.exports = mongoose.model('Friendlist', friendlist);

module.exports.findbyemail = function(data, callback){
    var query = {email: data.email};
    friendlists.findOne(query,callback).populate({path:'friendsid', populate:{path:'profilepic'}}) 
}