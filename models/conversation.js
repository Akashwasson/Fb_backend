const mongoose = require('mongoose'); 

  const  ConversationSchema = mongoose.Schema({  
    participants:  [],
    messages:   [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
});

const conversation = module.exports = mongoose.model('Conversation', ConversationSchema);  

module.exports.findList = (data) => {
  return	conversation.find({participants:{$in:[{id:data._id}]}});
}

// add to list 
module.exports.addToConverstionList = function(data, callback){
  var query= {participants:{$all:[
      {"$elemMatch":{id:data.from}},{"$elemMatch":{id:data.to}}]}};
  var datad = {
      participants:   [data.from,data.to]
  } 
  conversation.findOneAndUpdate(query,datad,{upsert:true, new: true },callback);
}

module.exports.AddRefOfMessage = (data, callback) => {  
      var query= {participants:{$all:[
          {"$elemMatch":{id:data.from}},{"$elemMatch":{id:data.to}}]}
          };
      conversation.findOneAndUpdate(query, {participants:[{id: data.from},{id: data.to}],$push: {messages:data.ref
      }},{ upsert: true , new : true}, callback)
  
}

module.exports.getUsersWithMessage = (data, callback) => {
  conversation
  .find({participants:{$all:[
      {"$elemMatch":{id:data.from}},{"$elemMatch":{id:data.to}}]}})
   .populate('messages').exec(callback);
  
}


