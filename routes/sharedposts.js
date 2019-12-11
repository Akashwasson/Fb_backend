const express = require('express');
const router = express.Router();
const Sharedpost = require('../models/sharedpost');

// router.post('/',(req,res)=>{
//     const sharedpost = new Sharedpost({
//         _id : req.body._id
//     })
//     sharedpost.save().then(result=>{
//         res.send(result)
//       })
//       .catch(err=>{
//           error:err
//       })
// });

router.get("/:Id", (req,res) =>{
    Sharedpost.find({_id: req.params.Id}).populate({path:'posts', populate:{path:'profilepic comments',populate:{path:'userid',populate:{path:'profilepic'}}}}).sort({ _id: -1 })
    .exec().then(result=>{
     res.send(result)
   })
   .catch(err=>{
       error:err
   })
  });

  router.post("/", (req,res)=>{
    var datad={
        id:req.body._id,
        postid:req.body.postid
    }  
    Sharedpost.addpost(datad,(err,callback)=>{
      if(err){ 
          res.json({success: false, msg:'Failed', error: err});
        } else {
         
          if(callback!=[]){
            res.json({
              msg:"successfull"
            })
          }
        }
    })
  });
module.exports =router;