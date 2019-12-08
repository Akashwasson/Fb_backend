const express = require ('express');
const router = express.Router();
const mongoose = require ('mongoose');
const multer = require ('multer');
const Image = require ('../models/image');
const fs = require ('fs')

// upload = multer({limits: {fileSize: 2000000 },dest:'./images/'})
  
 
  router.post("/", (req,res,next) =>{
   
    var data= req.body;
    var base64Data = req.body.base64Data.split("/");
    var filetype = base64Data[1].replace(/,/g,"").split(';');
    var encoding= filetype[1];
    filetype = filetype[0];
    base64Data.splice(0,2);
    base64Data='/'+base64Data.join('/');
    var fileName = data.userid +  new Date().toISOString().replace(/:/g, '-') + data.filename ;
    fs.writeFile('./uploads/'+ fileName, base64Data, encoding, function(err) {
      // console.log(err, 'this is error');
    });
    
    const imgdata =new Image({
        userid: req.body.userid,
        filename: req.body.filename,
        filetype: filetype,
        fileName:fileName
    }).save();

    return res.json({ type:filetype, encoding: encoding, base: base64Data})

  });  

  router.get("/", (rq,res) =>{
    Image.find().populate('comments')
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
  

  module.exports = router;