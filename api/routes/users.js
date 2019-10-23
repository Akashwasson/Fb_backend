const express = require('express');
const router = express.Router();
const mongoose = require ('mongoose');
const User = require('../models/user');
const Userdata = require('../models/userdata');
const Friendlist = require('../models/friendlist');
const Friendpost = require('../models/friendspost');

// Register
router.post('/', (req, res, next) => {
  let newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    dob:req.body.dob,
    sex:req.body.sex
  });
  
  
  User.addUser(newUser, (err, user) => {
    if(err){
      res.json({success: false, msg:'Failed to register user'});
    } else {
      res.json({success: true, msg:'User registered'});
    }
  });

  const posted = new Userdata({
    _id: new mongoose.Types.ObjectId(),
    username: req.body.firstName + " "+ req.body.lastName,
    email: req.body.email,  
});
 console.log(posted)
// console.log(posted._id)
posted.save()
   // creating empty friendlist for each user
  const friendlist = new Friendlist({
       email : req.body.email,  
  })
   friendlist.save();

   const friendpost = new Friendpost({
     email : req.body.email,
     _id : posted._id
   })
   friendpost.save();
});

router.get("/", (req, res)=>{
  User.find().then(result => {
  res.status(201).send(result)
  })
  .catch(err=>{
    error:err
})
});

router.get("/:id", (req, res)=>{
  User.getUserById(req.params.id,(err, user)=> {
    if(err){
      res.json({success: false, msg:'Failed to find register user'});
    } else {
      console.log(user)
      res.json({success: true, msg:'Founded registered user sucessfully'});
      
    }
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  res.send('AUTHENTICATE');
});

// Profile
router.get('/profile', (req, res, next) => {
  res.send('PROFILE');
});

module.exports = router;
