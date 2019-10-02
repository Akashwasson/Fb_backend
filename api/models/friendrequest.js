const mongoose = require('mongoose');

const friendrequest = mongoose.Schema({
    participants:[],
    requester: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Userdata' }],
    recipient: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Userdata' }],
    status:     {type: String,enum:['Accepted', 'Requested','Rejected'], default: 'Requested'},
    createdAt:  {type: Date},

})

var friendrqst = module.exports = mongoose.model('Friendrequest', friendrequest);

module.exports.findbyrecipient = function(data, callback){
  var  query = {recipient: data.recipient}
    friendrqst.findOne(query,callback);
}

module.exports.findbyrequester = function(data, callback){
    var  query = {requester: data.requester}
      friendrqst.findOne(query,callback);
}

module.exports.sendrequest = function(data,callback){
    var query= {participants:{$all:[
        {"$elemMatch":{id:data.requester}},{"$elemMatch":{id:data.recipient}}]}};
        var datad = {
            requester: data.requester,
            recipient: data.recipient,
            status: 'Requested',
            participants:   [{id:data.requester},{id:data.recipient}],
            createdAt:      new Date(),
        }
        // ,datad,{upsert:true, new: true },
      friendrqst.findOneAndUpdate(query,datad,{upsert:true, new: true },callback).then(doc=>{
        if(doc)
        {console.log(doc,'this is doc')
      }
      else(
        console.log('fuck')
      )
      }) 
}

module.exports.acceptrequest = function(data,callback){
    var query= {participants:{$all:[
        {"$elemMatch":{id:data.requester}},{"$elemMatch":{id:data.recipient}}]}};
       var datad = {
            status: 'Accepted',
            createdAt:      new Date(),
        }
      friendrqst.findOneAndUpdate(query,datad,callback); 
      // write a function in socket to push emails in friendlists  using their emails
}

module.exports.rejectrequest = function(data,callback){
    var query= {participants:{$all:[
        {"$elemMatch":{id:data.requester}},{"$elemMatch":{id:data.recipient}}]}};

      friendrqst.findOneAndDelete(query,callback) ; 
}
