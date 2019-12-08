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
        const frndrqst = new Friendrequest({
            sentto: req.body.id
        })
       
        frndrqst.save()
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
  });

  router.post("/statusAccpected",(req,res)=>{
    try{ 
    var datad = {
          requester:req.body.requester,
          recipient:req.body.recipient
      }
      Friendrequest.acceptrequest(datad,(err,callback)=>{
        if(err){
         
            res.json({success: false, msg:'Failed', error: err});
          } else {
           
            res.send(callback)
          }
        })
} catch (error) {
    
}
  })

  router.get("/byid/:recipientid", (req,res) =>{   
    try {
        var datad ={
            recipient: req.params.recipientid
        }
        Friendrequest.findbyrecipient(datad,(err,callback)=>{
            if(err){
             
                res.json({success: false, msg:'Failed', error: err});
              } else {
               
                res.send(callback)
              }
            })
    } catch (error) {
        
    }
  })

  router.delete("/:friendid/:myid",(req,res)=>{
   var data = {
     requester:req.params.myid,
     recipient:req.params.friendid
   }
   Friendrequest.rejectrequest(data,(err,callback)=>{
     if (callback){
      //  console.log('succesfull')
     }

   })
   })

module.exports = router;