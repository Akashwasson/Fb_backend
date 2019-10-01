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
const io =socket(server);
var Mysocket = require('./socket/mysocket')

// for sockets
Mysocket.mysocket(io);

const port = process.env.PORT || 4000;

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






