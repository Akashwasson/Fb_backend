const express = require ('express');
const router = express.Router();
const mongoose = require ('mongoose');
const Post = require ('../models/post');
const Userdata = require('../models/userdata');
const fs = require ('fs')
 
  router.post("/", (req,res,next) =>{
    
    var data= req.body;
    Userdata.findById( data.userid)
    .then(result=>{
      console.log(result, 'this is result')
      if(!result){
        // return res.status(404).json({
        //     message: "Userdata not found"
            
        //   });
        console.log(1)
        }
   
    if(data.base64Data==""){
      console.log(2)
      const posttext = new Post({
        _id: mongoose.Types.ObjectId(),
        userid: data.userid,
        text_post: data.text_post,
        profilepic: data.profilepic,
        username: data.username,
        createdAt:      new Date(),
      })
      console.log(3)
       console.log(posttext)
          posttext.save()
        return;
    }
    var base64Data = req.body.base64Data.split("/");
    console.log(base64Data[1]);
    var filetype = base64Data[1].replace(/,/g,"").split(';');
    var encoding= filetype[1];
    filetype = filetype[0];
    console.log(filetype);
    base64Data.splice(0,2);
    base64Data='/'+base64Data.join('/');
    var fileName = data.userid +  new Date().toISOString().replace(/:/g, '-') + data.filename ;
    fs.writeFile('./uploads/posts/'+ fileName, base64Data, encoding, function(err) {
      //  console.log(err, 'this is error
    
    });
    
    const imgdata =new Post({
      _id: mongoose.Types.ObjectId(),
      userid: data.userid,
      text_post: data.text_post,
      image:fileName,
      profilepic: data.profilepic,
      username: data.username,
      createdAt:      new Date(),
    })
     imgdata.save()
    console.log(imgdata._id,"this is doc") 
     

})
.catch(err=>{
   error:err
})

    // return res.json({ type:filetype, encoding: encoding, base: base64Data})

  });  

  router.get("/", (req,res) =>{
    Post.find().populate('profilepic').populate('comments')
    .exec().then(result=>{
     res.send(result)
   })
   .catch(err=>{
       error:err
   })
  })

  router.get("/byuserid/:userid", (req,res) =>{
    Post.find({userid: req.params.userid}).sort({ _id: -1 }).populate('profilepic').populate('comments')
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

  router.get("/:Id", (req,res) =>{
    Post.findById(req.params.Id)
    .exec().then(result=>{
     console.log(res.send(result))
   })
   .catch(err=>{
       error:err
   })
  })
  
  router.delete("/:Id", (req,res) =>{
    Post.remove({_id:req.params.Id})
    .exec().then(result=>{
   res.send(result)
   })
   .catch(err=>{
       error:err
   })
  })

  module.exports = router;

