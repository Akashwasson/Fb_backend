const express = require('express');
const router = express.Router();
const mongoose = require ('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user');
const Userdata = require('../models/userdata');
const Friendlist = require('../models/friendlist');
const Friendpost = require('../models/friendspost');
const Introschema = require('../models/intro');

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
  //  try {
  //   if(err){
  //     res.json({success: false, msg:'Failed to register user'});
  //   } else {
  //     res.json({success: true, msg:'User registered'});
  //   }
  //  } catch (error) {
  //    console.log(error,'dfsdf')
  //  } 
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
         console.log(error)
      }
     }
  });

  const posted = new Userdata({
    _id: new mongoose.Types.ObjectId(),
    username: req.body.firstName + " "+ req.body.lastName,
    email: req.body.email,  
});
 
posted.save()
   // creating empty friendlist for each user
  const friendlist = new Friendlist({
       email : req.body.email,  
       _id : posted._id
  })
   friendlist.save();

   const friendpost = new Friendpost({
     email : req.body.email,
     _id : posted._id
   })
   friendpost.save();

   const introschema = new Introschema({
     email : req.body.email,
     _id : posted._id
   })
   introschema.save();

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
  const email = req.body.email;
  const password = req.body.password;
 
  User.getUserByemail(email, (err, user) => {
    console.log(user)
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
