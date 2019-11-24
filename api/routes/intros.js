const express = require('express');
const router = express.Router();
const introschema = require('../models/intro');

router.post("/",(req,res)=>{
  try {
      var datad = {
        _id: req.body._id,
        email: req.body.email,
        describe:req.body.describe,
        work: req.body.work,
        college: req.body.college,
        school: req.body.school,
        livesin: req.body.livesin,
        from: req.body.from,
        instagram: req.body.instagram,
        mail: req.body.mail
    }
    introschema.fillintro(datad,(err,callback)=>{
        if(err){       
            res.json({success: false, msg:'Failed', error: err});
          } else {
          res.send(callback)
          }
    })    
  } catch (error) {     
  }

});

router.get("/", (req,res) =>{
    introschema.find()
    .exec().then(result=>{
     res.send(result)
   })
   .catch(err=>{
       error:err
   })
  });

  router.get("/:email", (req,res) =>{
    datad={
        email:req.params.email
    }
   introschema.findbyemail(datad,(err,callback)=>{
      if(err){
       
          res.json({success: false, msg:'Failed', error: err});
        } else {
          //  console.log(callback)
          res.send(callback)
        }
    })
})

module.exports = router;