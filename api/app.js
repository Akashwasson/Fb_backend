const express = require('express');
const app = express();
let http = require('http');
let server = http.Server(app);
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./DB');
const socket = require('socket.io');
const io =socket(server)
var SocketManager = require('./models/socketManager');
var Messages = require('./models/messages');
var Conversation = require('./models/conversation');

const port = process.env.PORT || 4000;
 
io.on('connection', (socket) => {
  
  socket.on('registeruser', function(data){
    // need {_id: userid} 
    try{
    data.socketId = socket.id;
    console.log(socket.id)
    SocketManager.addUserSocket(data,(err,call)=>{})
    }
    catch(err){
    }
    // console.log(data,'user connected');
  })

  socket.on('join', async (data) => {

    try{
      Conversation.getUsersWithMessage(data,(err,call)=>{
        if(err){
          console.log('Failed to register user');
        } 
        if (call!=[]){
          // console.log(call,'this is call')
            io.to(socket.id).emit('receiveprevmessage', call[0]);
        }
      })
  }
  catch(err){}
     
});

socket.on('sendmessage',async function(data){
  try{
    // to from and group id {to: '',from:'',groupid:'', message:''}
    var sauth = await SocketManager.auth({socketId:socket.id, userId: data.from})

    if(sauth==null){  return console.log("Hacker tried to temper with system",data ,  socket.id)}
    var mymessage =await Messages.addMessage(data)
    data.ref = mymessage._id;
     Conversation.AddRefOfMessage(data,async (err,somedata)=>{
      // Conversation.getUsersWithMessage(data,(err,call)=>{
      //   if (call!=[]){
      //     // console.log(call,'this is call')
      //       io.to(socket.id).emit('receiveprevmessage', call[0]);
      //   }
      // })
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

})

socket.on('disconnect', function (reason) {
  console.log('A user disconnected ' + socket.id);
  try{
    SocketManager.disconnectSocket(socket.id,(err,call)=>{})
  }
  catch(err){}
});

  
});
//start server
server.listen(port, () => {
  console.log(`started on port: ${port}`);
});
mongoose.connect(config.DB);

mongoose.connection.on('connected', () => {
  console.log('Connected to database '+config.DB);
});

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: '+err);
});



app.use(cors());
app.use(express.static(__dirname + '/uploads'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

const images = require ('./routes/images');
const users = require('./routes/users');
const posts = require('./routes/posts');
const comments = require('./routes/comments');
const usersdata = require('./routes/usersdata');
const profilepics = require('./routes/profilepics');
const coverpics = require('./routes/coverpics');
const friendlists = require('./routes/friendlists');
const friendrequests = require('./routes/friendrequests');
const likes = require('./routes/likes');
const socketManager = require('./routes/socketManagers')


app.use('/images', images)
app.use('/users', users);
app.use('/posts', posts);
app.use('/comments', comments);
app.use('/usersdata', usersdata)
app.use('/profilepics', profilepics);
app.use('/coverpics', coverpics);
app.use('/friendlists',friendlists);
app.use('/friendrequests',friendrequests);
app.use('/likes',likes);
app.use('/socketmanager',socketManager);

// Index Route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});





