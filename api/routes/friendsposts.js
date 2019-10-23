const express = require('express');
const router = express.Router();
const Friendspost = require('../models/friendspost');

router.post('/',(req,res)=>{
    const friendspost = new Friendspost({
        email: req.body.email,
        _id : req.body._id
    })
    friendspost.save().then(result=>{
        res.send(result)
      })
      .catch(err=>{
          error:err
      })
});

router.get('/',(req,res)=>{
    Friendspost.find().sort({ _id: -1 }).populate({path:'posts', populate:{path:'profilepic comments'}})
    .then(result=>{
        res.send(result)
      })
      .catch(err=>{
          error:err
      })
})
router.get("/:Id", (req,res) =>{
    Friendspost.find({_id: req.params.Id}).populate({path:'posts', populate:{path:'profilepic comments',populate:{path:'userid',populate:{path:'profilepic'}}}}).sort({ _id: -1 })
    .exec().then(result=>{
     res.send(result)
   })
   .catch(err=>{
       error:err
   })
  });
  
  router.delete("/:Id/:postid", (req,res)=>{
    var datad={
        Id:req.params.Id,
        postid:req.params.postid
    }
    
    Friendspost.removepost(datad,(err,callback)=>{
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

module.exports = router;