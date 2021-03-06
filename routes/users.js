const express = require('express');
const router = express.Router();
const mongoose = require ('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user');
const Userdata = require('../models/userdata');
const Friendlist = require('../models/friendlist');
const Friendpost = require('../models/friendspost');
const Introschema = require('../models/intro');
const Sharedpost = require('../models/sharedpost');

// Register
router.post('/',  (req, res, next) => {
  let newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    dob:req.body.dob,
    sex:req.body.sex
  });
  
  User.addUser(newUser, (err, user) => {
     if(user){     
      //creating token here 
      try {       
        User.getUserByemail(req.body.email, (err, user) => {
          if(err) throw err;
          if(!user) {
            return  res.json({success: false, msg: 'Wrong email'});
          }
          
          User.comparePassword(req.body.password, user.password, (err, isMatch) => {
            
            if(err) throw err;
            if(isMatch) {            
              const token = jwt.sign({data: user}, config.secret, {
                expiresIn: 604800 // 1 week
              });
             
              res.json({
                success: true,
                token: token,
                user: {
                  id: user._id,
                  name: user.firstName,
                  email: user.email
                }
              })
            } else {
              return  res.json({success: false, msg: 'Wrong password'});
            }
          });
        });
      } catch (error) {
      }
     }
  });

  // this is the main model..it contains username ,userid, profilepic,coverpic and email
  const posted = new Userdata({
    _id: new mongoose.Types.ObjectId(),
    username: req.body.firstName + " "+ req.body.lastName,
    email: req.body.email,  
});
 
posted.save()
   // creating empty friendlist for the new user
  const friendlist = new Friendlist({
    email : req.body.email,  
    _id : posted._id
  })
   friendlist.save();
   // creating empty friendpost for the new user
   const friendpost = new Friendpost({
     email : req.body.email,
     _id : posted._id
   })
   friendpost.save();
   
   // creating empty sharedpost model for the new user
   const sharedpost = new Sharedpost({
    _id: posted._id
  })
  sharedpost.save();

    // creating empty introduction for the new user
   const introschema = new Introschema({
     email : req.body.email,
     _id : posted._id
   })
   introschema.save();

});

// reset password
router.post("/reset",async (req,res)=>{
 
  User.resetPassword(req.body,(err, user)=> {
    if(!user) {
      return res.json({success: false, msg: 'wrong email'});
    }

    if(err){
      return res.json({success: false, msg:'Failed'});
    } else {
      res.json({success: true, msg: 'Successfull'});  
    
    }
})
})

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
      res.json({success: true, msg:'Founded registered user sucessfully'});
      
    }
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
 
  User.getUserByemail(email, (err, user) => {
    if(err) throw err;
    if(!user) {
      return res.json({success: false, msg: 'Wrong email'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch) {
        
        const token = jwt.sign({data: user}, config.secret, {
          expiresIn: 604800 // 1 week
        });
        res.json({
          success: true,
          token: token,
          user: {
            id: user._id,
            name: user.firstName,
            email: user.email
          }
        })
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});




module.exports = router;
