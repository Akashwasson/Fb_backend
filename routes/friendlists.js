const express = require ('express');
const router = express.Router();
const mongoose = require ('mongoose');
const Friendlist = require('../models/friendlist');
const Friendrequest = require('../models/friendrequest');
const Userdata = require('../models/userdata');

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
    datad={
        email:req.params.email
    }
   Friendlist.findbyemail(datad,(err,callback)=>{
      if(err){
       
          res.json({success: false, msg:'Failed', error: err});
        } else {
          res.send(callback)
        }
    })
})

router.delete("/:email/:friendid",(req,res)=>{
 var datad={
    email:req.params.email,
    friendid:req.params.friendid
}

Friendlist.removefriend(datad,(err,callback)=>{
  if(err){ 
      res.json({success: false, msg:'Failed', error: err});
    } else {
     
      if(callback!=[]){
        res.json({
          msg:"successfull"
        })
      }
    }
});
})

module.exports = router;

