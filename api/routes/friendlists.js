const express = require ('express');
const router = express.Router();
const mongoose = require ('mongoose');
const Friendlist = require('../models/friendlist');
const Userdata = require('../models/userdata');

router.post('/', (req,res)=>{
    Userdata.findById(req.body.userid).then(result=>{
        if(!result){
            res.status(400).json({
                message:"user not found"
            })
        }

        const friends = new Friendlist({
            email: req.body.email,
        //    friendsid : req.body.userid
        }).save().then(doc=>{
            res.json({
                message:'succesfull'
            })
        })
    })
    .catch(err=>{
        error:err
     })
});

router.get("/", (req,res) =>{
    Friendlist.find().populate('friendsid')
    .exec().then(result=>{
     res.send(result)
   })
   .catch(err=>{
       error:err
   })
  })

  router.get("/:email", (req,res) =>{
    Friendlist.find({email:req.params.email}).populate({path:'friendsid', populate:{path:'profilepic'}})
    .exec().then(result=>{
        if(!result){
            console.log(1)
        }
     res.send(result)
   })
   .catch(err=>{
       error:err
   })
  })

module.exports = router;

