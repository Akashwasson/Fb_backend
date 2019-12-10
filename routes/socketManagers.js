const express = require('express');
const router = express.Router();
const socketManager = require('../models/socketManager');

router.get("/byuserid/:userid",(req,res)=>{
    var datad =  {
        userId: req.params.userid
    }
  socketManager.findbyuserid(datad,(err,callback)=>{
    if(err){
     
        res.json({success: false, msg:'Failed', error: err});
      } else {
       
        res.send(callback)
      }
  })
});

module.exports = router;