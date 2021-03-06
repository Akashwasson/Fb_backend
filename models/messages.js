var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    sender:         {type: String},
    reciever:         {type: String},
    message:        {type: String},
    type:           {type: String},
    createdAt:      {type: Date},
    seenAt:         {type: Date, default: null},
});

const Messages = module.exports =  mongoose.model('Message' , messageSchema);

module.exports.findCSocket = (data) => {
    return	Messages.findOne({userId:data});
}

module.exports.addMessage = function(data){
    var datad = {
        sender:         data.from,
        reciever:        data.to,
        message :       data.msg,
        createdAt:       new Date(),
        type:            'text'
    }
    
   return Messages.create(datad);
}

module.exports.seen = function(data, callback){
    var query = {_id: data._id};
    var datad = {
        seenAt:  new Date()
    }
    Messages.findOneAndUpdate(query,datad,{upsert:false, new: true },callback);
  
  }