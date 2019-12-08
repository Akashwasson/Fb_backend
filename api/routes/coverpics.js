const express = require ('express');
const router = express.Router();
const mongoose = require ('mongoose');
const fs = require ('fs');
const Image = require ('../models/coverpic');
const Userdata = require ('../models/userdata')
 

  router.post("/", (req,res) =>{
    Userdata.findById(req.body._id)
    .then(doc => {
      if(!doc){
         return res.status(404).json({
             message: "user not found"
           });
        }
         var data= req.body;
         if(data.base64Data==""){
          const imgdata =new Image({
           _id: mongoose.Types.ObjectId(),
           userid: data._id,
          // coverpic: "finalcover.jpg"         
       }) 
       imgdata.save()  
       doc.coverpic.push(imgdata._id) 
         doc.save()
 
          return;
         }
         var base64Data = req.body.base64Data.split("/");
         var filetype = base64Data[1].replace(/,/g,"").split(';');
         var encoding= filetype[1];
         filetype = filetype[0];
         base64Data.splice(0,2);
         base64Data='/'+base64Data.join('/');
         var fileName = data._id +  new Date().toISOString().replace(/:/g, '-') + data.filename ;
         fs.writeFile('./uploads/'+ fileName, base64Data, encoding, function(err) {
         });
         const imgdata =new Image({
            _id: mongoose.Types.ObjectId(),
            userid: data._id,
            coverpic:fileName
        })     
        imgdata.save()  
        doc.coverpic.push(imgdata._id) 
        doc.save()                       
    })
     .catch(err=>{
        res.status(500).json({
            message: " failed",
            error: err
        })
    })
   
  });  


  router.get("/", (req,res) =>{
    Image.find()
    .exec().then(result=>{
      res.send(result)
   })
   .catch(err=>{
       error:err
   })
  })

  router.get("/:Id", (req,res) =>{
    Image.findById(req.params.Id)
    .exec().then(result=>{
      res.send(result)
   })
   .catch(err=>{
       error:err
   })
  })
  router.delete("/:Id", (req,res) =>{
    Image.remove({_id:req.params.Id})
    .exec().then(result=>{
      res.send(result)
   })
   .catch(err=>{
       error:err
   })
  })
  
  router.post("/emptyarray", (req,res) =>{
    datad={
      userid:req.body.userid
  }
 Image.emptyarray(datad,(err,callback)=>{
   
    if(err){
        res.json({success: false, msg:'Failed', error: err});
      } else {
        res.send(callback)
      }
  })
  })

  module.exports = router;

