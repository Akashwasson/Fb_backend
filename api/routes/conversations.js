const express = require ('express');
const router = express.Router();
const mongoose = require ('mongoose');
const Friendlist = require('../models/friendlist');
const Conversation = require('../models/conversation');

router.post('/',(req,res)=>{
   const conversation = new Conversation({
     senderid:req.body.senderid,
      recieverid:req.body.recieverid
   }).save()
   .then(doc=>{
    res.json({
        message:'succesfull'
    })
})
.catch(err=>{
    error:err
    })
});

router.get("/", (req,res) =>{
    Conversation.find().populate("participants")
    .exec().then(result=>{
     res.send(result)
   })
   .catch(err=>{
       error:err
   })
  });

  router.get("/byid", (req,res) =>{
    Conversation.find({recieverid:req.body.recieverid})
    .exec().then(result=>{
     res.send(result)
   })
   .catch(err=>{
       error:err
   })
  })


module.exports= router;