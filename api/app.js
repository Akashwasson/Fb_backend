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

const port = process.env.PORT || 4000;
 
io.on('connection', (socket) => {
  
  socket.on('registeruser', function(data){
    // need {_id: userid} 
    try{
    data.socketId = socket.id;
    console.log(socket.id)
    SocketManager.addUserSocket(data,(err,call)=>{
      if(err){
        console.log('Failed to register user');
      } else {
        console.log('successful to register user');
      }

    })
    }
    catch(err){
    }
    // console.log(data,'user connected');
  })

  socket.on('join', async (data) => {
    // socket.join(data.room)
    try{
      var sendto = await SocketManager.findSocket(data.to);
      
      if(data.msg != null){
        if(sendto != null){
          console.log(sendto.socketId,data.to,'this is sendto')
      io.to(sendto.socketId).emit('new_msg', {from:data.from, to:data.to, msg: data.msg});
      io.to(socket.id).emit('new_msg', {from:data.from, to:data.to, msg: data.msg});  
      }
    }
  }
  catch(err){}
     
});

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
const conversations = require('./routes/conversations')


app.use('/images', images)
app.use('/users', users);
app.use('/posts', posts);
app.use('/comments', comments);
app.use('/usersdata', usersdata)
app.use('/profilepics', profilepics);
app.use('/coverpics', coverpics);
app.use('/friendlists',friendlists);
app.use('/friendrequests',friendrequests);
app.use('/conversations',conversations)

// Index Route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});





