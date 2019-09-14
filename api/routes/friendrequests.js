const express = require ('express');
const router = express.Router();
const mongoose = require ('mongoose');
const Friendlist = require('../models/friendlist');
const Friendrequest = require('../models/friendrequest');
const Userdata = require('../models/userdata');


router.post('/accepted',(req,res)=>{
    Friendlist.findOneAndUpdate({email:req.body.email}, {$push:{friendsid: req.body.id}})
    .exec().then(result=>{
        if(!result){
            res.status(401).json({
                msg:"Friendlist of this user not found"
            })
        }
        res.json({
            msg:"successfull"
        })
    //    const frnd = new Friendlist({
    //       friendsid: req.body.id
    //    }).save().then(doc=>{
    //        res.json({
    //            msg:"sucessfull"
    //        })
    //    })
   })
    
   .catch(err=>{
       error:err
   })
});

router.post('/send',(req,res)=>{
    Friendlist.find({email:req.body.email})
    .exec().then(result=>{
        if(!result){
            res.status(401).json({
                msg:"Friendlist of this user not found"
            })
            
        }
        console.log('efsef')
        const frndrqst = new Friendrequest({
            sentto: req.body.id
        })
       
        frndrqst.save().then(doc=>{
            if(!doc){
                console.log(1)
            }
            console.log(2)
        })
          
    
   })
    
   .catch(err=>{
       error:err
   })
});

router.get("/", (req,res) =>{
    Friendrequest.find()
    .exec().then(result=>{
     res.send(result)
   })
   .catch(err=>{
       error:err
   })
  })

module.exports = router;