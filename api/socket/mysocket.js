var SocketManager = require('../models/socketManager');
var Messages = require('../models/messages');
var Conversation = require('../models/conversation');

 var usersconnected ={};
 var friendsid = [];

module.exports.mysocket = (io)=>{

    io.on('connection', (socket) => {
  
      socket.on('registeruser', async function(data){
        // need {_id: userid} 
        try{
        data.socketId = socket.id;
        // console.log(socket.id)
        usersconnected[socket.id] = data._id;
        friendsid = data.frndsids
        SocketManager.addUserSocket(data,(err,call)=>{})
        // user will send his online status to all of his friends
        for(var i=0; i<friendsid.length;i++){
        var sendto = await SocketManager.findSocket(friendsid[i]);
        // console.log(sendto.socketId,i)
        io.to(sendto.socketId).emit('online',{userId:data._id, status:"Online"})
        }
        console.log(friendsid[socket.id].length,'this iszzz')
        }
        catch(err){
        }
        // console.log(friendsid,'user connected');
       })
      
      socket.on('prevmsgs', async (data) => {
      
          try{
            Conversation.getUsersWithMessage(data,(err,call)=>{ 
              if (call!=[]){
                 
                  io.to(socket.id).emit('receiveprevmessage', call[0]);
              }
            })
        }
        catch(err){}
           
      });
      
      socket.on('sendmessage',async function(data){
        try{
          // to from {to: '',from:'', message:''}
          var sauth = await SocketManager.auth({socketId:socket.id, userId: data.from})
      
          if(sauth==null){  return console.log("Hacker tried to temper with system",data ,  socket.id)}
          var mymessage =await Messages.addMessage(data)
          data.ref = mymessage._id;
           Conversation.AddRefOfMessage(data,async (err,somedata)=>{
           
            var sendto = await SocketManager.findSocket(data.to);
            
            if(data.msg != null){
              if(sendto != null){
                console.log(sendto.socketId,data.to,'this is sendto')
            io.to(sendto.socketId).emit('new_msg', {from:data.from, to:data.to, msg: data.msg});
            io.to(socket.id).emit('new_msg', {from:data.from, to:data.to, msg: data.msg});  
            }
          }
            
          });
        
        }catch(err){}
      
      });

      socket.on('loadstatus', async function(data){
          try {
            friendsid = data.frndsids
              // user will send his online status to all of his friends
        for(var i=0; i<friendsid.length;i++){
            var friends = await SocketManager.findSocket(friendsid[i]);
            
            io.to(socket.id).emit('status',{userId:friends.userId, status:friends.status})
         
            }
            // console.log(data.frndsids,'this is length')

              
          } catch (error) {}
 
      } )
      
      socket.on('disconnect',async function (reason) {
        console.log('A user disconnected ' + socket.id);
        try{
             var id = usersconnected[socket.id]  
             SocketManager.disconnectSocket(socket.id,(err,call)=>{})  
              //user will send offline status to all of his friends
          for(var i=0; i<friendsid.length;i++){
            var sendto = await SocketManager.findSocket(friendsid[i]);       
             io.to(sendto.socketId).emit('offline',{userId:id, status:"Offline"})
             console.log(sendto.socketId,'this is friendsis')       
           }
          
        }
        catch(err){}
      });
      
      });
}