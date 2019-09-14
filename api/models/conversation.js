const mongoose = require('mongoose'); 


  const  ConversationSchema = mongoose.Schema({  
      
      senderid:String,
      recieverid:String,
    
});

module.exports = mongoose.model('Conversation', ConversationSchema);  