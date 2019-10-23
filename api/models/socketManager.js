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
module.exports.findbyuserid =function(data, callback) {
    var query = {userId:data.userId} 
    socManager.findOne(query,callback)
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
        disconenctedAt: new Date(),
        status:        'Offline',
    }
    // console.log('this is disconnect')
    socManager.findOneAndUpdate(query,datad,callback);
   
}
module.exports.auth = (data)=>{
    // console.log(data);
    return socManager.findOne({socketId:data.socketId, userId: data.userId , status: 'Online'})
}