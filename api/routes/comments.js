const express = require ('express');
const router = express.Router();
const mongoose = require ('mongoose');
const Comment = require('../models/comment');
const Post = require('../models/post');

router.get("/", (req,res)=>{
    Comment.find()
    .exec().then(result=>{
      res.send(result)
    //  console.log(res.send(result))
   })
   .catch(err=>{
       error:err
   })
 });
 
 router.post("/", (req,res,next)=>{
  Post.findById(req.body.post_id)
  .then(data => {
    if(!data){
       return res.status(404).json({
           message: "Post not found"
         });
       }       
       const posted = new Comment({
           _id: new mongoose.Types.ObjectId(),
           comment_post: req.body.comment_post,
           post_id: req.body.post_id,
           userid:req.body.userid
       });
       posted.save()
       .then(result =>{
           res.status(201).json({ 
             message: "comment uploaded succesfully",
              createdcomment:{
                cmt_id:result._id,
                comment:result.comment_post,
                post_id: result.post_id,
                userid:result.userid
              }
           });
         })
         data.comments.push(posted._id)
         data.save()    
  })
   .catch(err=>{
      res.status(500).json({
        message: "comment failed",
        error: err
      })
  })
});

 
router.get("/:postid", (req,res)=>{
    Post.findById(req.params.postid).populate("comments")
    .then(result=>{
    res.send(result)
   })
   .catch(err=>{
       error:err
   })
 });

 router.delete("/:id", (req,res)=>{
  Comment.remove({_id:req.params.id})
  .then(result=>{
  res.send(result)
 })
 .catch(err=>{
     error:err
 })
});


module.exports = router;