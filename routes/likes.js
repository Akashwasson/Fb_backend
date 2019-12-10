const express = require('express');
const router = express.Router();
const Like = require('../models/like');

router.post("/",(req,res)=>{
 var datad = new Like({
     userid:req.body.userid,
     postid:req.body.postid
 })
 Like.addlikes(datad,(err,callback)=>{
    if(err){
        res.json({success: false, msg:'Failed', error: err});
      } else {
        res.json({success: true, msg:'Succesfull'});
      }
 });

});

router.post("/deletelike",(req,res)=>{
    var datad = new Like({
        userid:req.body.userid,
        postid:req.body.postid
    })
    Like.deluserlike(datad,(err,callback)=>{
       if(err){
           res.json({success: false, msg:'Failed', error: err});
         } else {
           res.send(callback);
         }
    });
   
   });
   

router.get("/:postid",(req,res)=>{
    var datad = new Like({
        postid:req.params.postid
    })
    Like.getuserids(datad,(err,callback)=>{
        if(err){
            res.json({success: false, msg:'Failed', error: err});
          } else {
            res.send(callback)
          }
     });
    
});

module.exports = router;