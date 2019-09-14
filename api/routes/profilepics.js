const express = require ('express');
const router = express.Router();
const mongoose = require ('mongoose');
const fs = require ('fs');
const Image = require ('../models/profilepic');
const Userdata = require ('../models/userdata')

  router.post("/", (req,res) =>{
    Userdata.findById(req.body._id)
    .then(doc => {
      if(!doc){
          console.log("not found")
         return res.status(404).json({
             message: "user not found"
           });
        }
         var data= req.body;
         var base64Data = req.body.base64Data.split("/");
        //  console.log(base64Data[1]);
         var filetype = base64Data[1].replace(/,/g,"").split(';');
         var encoding= filetype[1];
         filetype = filetype[0];
        //  console.log(filetype);
         base64Data.splice(0,2);
         base64Data='/'+base64Data.join('/');
         var fileName = data._id +  new Date().toISOString().replace(/:/g, '-') + data.filename ;
         fs.writeFile('./uploads/'+ fileName, base64Data, encoding, function(err) {
        //    console.log(err, 'this is error');
         });
         const imgdata =new Image({
            _id: mongoose.Types.ObjectId(),
            userid: data._id,
            profilepic:fileName
        })     
        console.log(imgdata._id,"this is doc") 
        imgdata.save()  
        doc.profilepic.push(imgdata._id) 
        doc.save()
        console.log(doc)                        
    })
     .catch(err=>{
     console.log(err)
        res.status(500).json({
            message: " failed",
            error: err
        })
    })
   
  });  
  

  router.get("/", (req,res) =>{
    Image.find()
    .exec().then(result=>{
     console.log(res.send(result))
   })
   .catch(err=>{
       error:err
   })
  })

  router.get("/:Id", (req,res) =>{
    Image.findById(req.params.Id)
    .exec().then(result=>{
     console.log(res.send(result))
   })
   .catch(err=>{
       error:err
   })
  })
  router.delete("/:Id", (req,res) =>{
    Image.remove({_id:req.params.Id})
    .exec().then(result=>{
     console.log(res.send(result))
   })
   .catch(err=>{
       error:err
   })
  })
  

  module.exports = router;

