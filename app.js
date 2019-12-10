const express = require('express');
const app = express();
const http = require('http');
const server = http.Server(app);
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./DB');
const socket = require('socket.io');
const io =socket(server);
var Mysocket = require('./socket/mysocket');


// for sockets
Mysocket.mysocket(io);

//port number
const port = process.env.PORT || 4000;

//cor middleware
app.use(cors());

//static folder
app.use(express.static(__dirname + '/uploads'));

//limiting the size
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
const socketManager = require('./routes/socketManagers');
const friendpost = require('./routes/friendsposts');
const introschema = require('./routes/intros');


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
app.use('/friendsposts', friendpost);
app.use('/introschema',introschema);

// Index Route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
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






