var SocketManager = require('../models/socketManager');
var Messages = require('../models/messages');
var Conversation = require('../models/conversation');
var friendrequest = require('../models/friendrequest');

 var usersconnected ={};
 var friendsid = [];
 var allfrnd=[];

module.exports.mysocket = (io)=>{

    io.on('connection', (socket) => {
     // registering logged in user with his all friends
      socket.on('registeruser', async function(data){    
        try{
        data.socketId = socket.id;
        usersconnected[socket.id] = data._id;
        //logged in user; All friends are registered here
        allfrnd[socket.id] = data.frndsids;
        friendsid = allfrnd[socket.id]
        SocketManager.addUserSocket(data,(err,call)=>{})
        // user will send his online status to all of his friends
        for(var i=0; i<friendsid.length;i++){
        var sendto = await SocketManager.findSocket(friendsid[i]);
        io.to(sendto.socketId).emit('online',{userId:data._id, status:"Online"})
        }
        }
        catch(err){
        }
       })
      
       // getting chat of selected user
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

      socket.on('messageseen',data=>{
        //senderid,recieverid,msgid
        try{
          data.forEach(element => {
            Messages.seen(element,async (err,mdata)=>{
              if(!err){
                var sendto = await SocketManager.findSocket(element.sender);
                sdata = {
                  sender: element.reciever,
                  messageId : mdata._id,
                  seenAt:   mdata.seenAt
                }
                if(sendto!= null)
                io.to(sendto.socketId).emit('seen', sdata);
              }
            })
          });
        }catch(err){
        }
      })
      
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
            io.to(sendto.socketId).emit('new_msg', mymessage);
            io.to(socket.id).emit('new_msg', mymessage);  
            }
          }
            
          });
        
        }catch(err){}
      
      });
      // send online status to all friends
      socket.on('sendstatus', async function(data){
          try {
            friendsid = data.frndsids
          // user will send his online status to all of his friends
            for(var i=0; i<friendsid.length;i++){
             var friends = await SocketManager.findSocket(friendsid[i]);           
             io.to(socket.id).emit('status',{userId:friends.userId, status:friends.status , socketId:socket.id});        
            }            
          } catch (error) {} 
      });
      // send offline status and also disconnect socket
      socket.on('end', async function() {
        try{
          var id = usersconnected[socket.id]  
          SocketManager.disconnectSocket(socket.id,(err,call)=>{})  
          var friendid = allfrnd[socket.id]
           //user will send offline status to all of his friends
          for(var i=0; i<friendid.length;i++){
            var sendto = await SocketManager.findSocket(friendid[i]);       
            io.to(sendto.socketId).emit('offline',{userId:id, status:"Offline"});              
        } 
         socket.disconnect();
     }
     catch(err){}        
    });
      
      socket.on('disconnect',async function (data) {     
        try{
             var id = usersconnected[socket.id]  
             SocketManager.disconnectSocket(socket.id,(err,call)=>{})  
             var friendid = allfrnd[socket.id]
              //user will send offline status to all of his friends
          for(var i=0; i<friendid.length;i++){
            var sendto = await SocketManager.findSocket(friendid[i]);       
             io.to(sendto.socketId).emit('offline',{userId:id, status:"Offline"})              
           } 
          
        }
        catch(err){}
      });
      // sending friend request
      socket.on('sendrqst',async function(data){
        try {
          friendrequest.sendrequest(data,async (err,call)=>{
            if(call!=[]){
              var sendto = await SocketManager.findSocket(data.recipient);
              io.to(sendto.socketId).emit('sendrequest',{_id:data.requester,email:data.email})
            }
          })        
        } catch (error) { }
      });

   });
}