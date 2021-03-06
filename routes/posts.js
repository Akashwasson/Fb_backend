const express = require ('express');
const router = express.Router();
const mongoose = require ('mongoose');
const Post = require ('../models/post');
const Userdata = require('../models/userdata');
const friendlist = require('../models/friendlist');
const friendpost = require('../models/friendspost')
const fs = require ('fs')
 
//video uploading here
router.post("/video",(req,res)=>{
  var list = []
    var data= req.body;
    Userdata.findById( data.userid).exec()
    .then(result=>{
      if(!result){
        return res.status(404).json({
           message: "Userdata not found"        
          });
        }
          var base64Data = req.body.base64Data.replace(/,/g,"/").split("/");
          var filetype = base64Data[1].replace(/,/g,"").split(';');
          var encoding= filetype[1];
          filetype = filetype[0];
          base64Data.splice(0,2);
          base64Data=base64Data.join('/');

          var fileName = data.userid +  new Date().toISOString().replace(/:/g, '-') + data.filename ;
          fs.writeFile('./uploads/posts/'+ fileName, base64Data, encoding, function(err) {
            //  console.log(err, 'this is error)
          
          });
          
          const videodata =new Post({
            _id: mongoose.Types.ObjectId(),
            userid: data.userid,
            text_post: data.text_post,
            video:fileName,
            profilepic: data.profilepic,
            username: data.username,
            email: data.email,
            createdAt:      new Date(),
          })
           videodata.save()
          var   datad={
            email:data.email
        }         
        // sending this post to all friends
          friendlist.findbyemail(datad,(err,callback)=>{
            if(err){
                res.json({success: false, msg:'Failed', error: err});
              } 
              else {
                list.push(callback)
                var friendsdata = '';
                  friendsdata =(list.map(item=>item.friendsid))
                  var ids = friendsdata[0].map(item=>item._id)
                  ids.push(data.userid)
                  for(var i =0; i<ids.length;i++){
                    var newdata ={
                      id: ids[i],
                      postid: videodata._id
                    }
                    friendpost.addposts(newdata,(err,callback1)=>{
                  try {
                    if(err){                    
                      res.json({success: false, msg:'Failed', error: err});
                    } else {                          
                      res.send(callback1)
                    }
                  } catch (error) {
                    
                  }  
                  })
                  }            
              }
          })
           
      .catch(err=>{
         error:err
      })
      
    })
    .catch(err=>{
      error:err
  })
})


// text and image posting here
  router.post("/", (req,res,next) =>{
    var list = []
    var data= req.body;
    Userdata.findById( data.userid).exec()
    .then(result=>{
      if(!result){
        return res.status(404).json({
            message: "Userdata not found"         
          });
        }
   
        // if user has not selected any pic
    if(data.base64Data==""){
      const posttext = new Post({
        _id: mongoose.Types.ObjectId(),
        userid: data.userid,
        text_post: data.text_post,
        profilepic: data.profilepic,
        username: data.username,
        email: data.email,
        createdAt:      new Date(),
      })
        posttext.save()
       var datad={
            email:data.email
        }
           // sending this post to all friends
          friendlist.findbyemail(datad,(err,callback)=>{
            if(err){
                res.json({success: false, msg:'Failed', error: err});
              } else {
                    list.push(callback)
                    var friendsdata = '';
                     friendsdata =(list.map(item=>item.friendsid))
                     var ids = friendsdata[0].map(item=>item._id)
                     ids.push(data.userid)
                     for(var i =0; i<ids.length;i++){
                       var newdata ={
                         id: ids[i],
                         postid: posttext._id
                       }
                       friendpost.addposts(newdata,(err,callback1)=>{
                      try {
                        if(err){
                         
                          res.json({success: false, msg:'Failed', error: err});
                        } else {
                          res.send(callback1)
                        }
                      } catch (error) {
                        
                      }  
                      })
                      
                      
                     }
                
              }
          })
        return;
    }
    // if user has selected an image
    var base64Data = req.body.base64Data.split("/");
    var filetype = base64Data[1].replace(/,/g,"").split(';');
    var encoding= filetype[1];
    filetype = filetype[0];
    base64Data.splice(0,2);
    base64Data='/'+base64Data.join('/');
    var fileName = data.userid +  new Date().toISOString().replace(/:/g, '-') + data.filename ;
    fs.writeFile('./uploads/posts/'+ fileName, base64Data, encoding, function(err) {
      //  console.log(err, 'this is error)
    
    });
    
    const imgdata =new Post({
      _id: mongoose.Types.ObjectId(),
      userid: data.userid,
      text_post: data.text_post,
      image:fileName,
      profilepic: data.profilepic,
      username: data.username,
      email: data.email,
      createdAt:      new Date(),
    })
     imgdata.save()
    var   datad={
      email:data.email
  }
     // sending this post to all friends
    friendlist.findbyemail(datad,(err,callback)=>{
      if(err){
          res.json({success: false, msg:'Failed', error: err});
        }
         else {
          list.push(callback)
          var friendsdata = '';
            friendsdata =(list.map(item=>item.friendsid))
            var ids = friendsdata[0].map(item=>item._id)
            //to myself also
            ids.push(data.userid)
            for(var i =0; i<ids.length;i++){
              var newdata ={
                id: ids[i],
                postid: imgdata._id
              }
              friendpost.addposts(newdata,(err,callback1)=>{
            try {
              if(err){
                
                res.json({success: false, msg:'Failed', error: err});
              } else {
                res.send(callback1)
              }
            } catch (error) {
              
            }  
            })
            }         
        }
    })
})
.catch(err=>{
   error:err
})
});  

  router.get("/", (req,res) =>{
    Post.find().populate('profilepic').populate('comments')
    .exec().then(result=>{
     res.send(result)
   })
   .catch(err=>{
       error:err
   })
  });


  router.get("/byuserid/:userid", (req,res) =>{
    Post.find({userid: req.params.userid}).sort({ _id: -1 }).populate({path:'profilepic comments',populate:{path:'userid',populate:{path:'profilepic'}}})
    .exec().then(result=>{
     res.send(result)
   })
   .catch(err=>{
       error:err
   })
  });

  router.get("/:Id", (req,res) =>{
    Post.findById(req.params.Id)
    .exec().then(result=>{
     res.send(result)
   })
   .catch(err=>{
       error:err
   })
  });
  
  router.delete("/:Id", (req,res) =>{
    Post.remove({_id:req.params.Id})
    .exec().then(result=>{
   res.send(result)
   })
   .catch(err=>{
       error:err
   })
  });

  module.exports = router;
