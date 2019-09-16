var mongoose = require('mongoose');

var userSocketSchema = mongoose.Schema({
    socketId:       {type: String},
    userId:         {type: String, unique: true},
    connectedAt:    {type: Date},
    status:         {type: String,enum:['Offline', 'Online'], default: 'Offline'},
    disconenctedAt: {type: Date}
})


const socManager = module.exports =  mongoose.model('socketManager' , userSocketSchema);

module.exports.findSocket = (data) => {
    return	socManager.findOne({userId:data})
    // .then(result=>{
    //     console.log(result,'this is result')
    // })
}

module.exports.addUserSocket = function(data, callback){
    // console.log('its working')
    var query= {userId: data._id};
    var datad = {
        socketId:       data.socketId,
        userId :        data._id,
        connectedAt:    new Date(),
        status:        'Online',
    }
    
    socManager.findOneAndUpdate(query,datad,{upsert:true, new: true },callback);
}

module.exports.disconnectSocket = function(data, callback){
    var query = {socketId: data};
    var datad = {
        status:        'Offline',
        disconenctedAt: new Date(),
    }
    socManager.findOneAndUpdate(query,datad,{upsert:false, new: true },callback);
   
}
module.exports.auth = (data)=>{
    // console.log(data);
    return socManager.findOne({socketId:data.socketId, userId: data.userId , status: 'Online'})
}