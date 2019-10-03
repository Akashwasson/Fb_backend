const express = require ('express');
const router = express.Router();
const Userdata = require ('../models/userdata');
const User = require ('../models/user');
const mongoose = require ('mongoose')

router.get('/', (req, res)=>{
   Userdata.find().populate("profilepic").populate('coverpic')
   .then(result=>{
        res.send(result)
   })
   .catch(err=>{
    error:err
})
     
});
router.delete('/:id', (req, res)=>{
  Userdata.remove({_id:req.params.id})
  .then(result=>{
       res.send(result)
  })
  .catch(err=>{
   error:err
})
    
});

router.get('/:Id',(req, res)=>{
 Userdata.findById(req.params.Id)
 .then(result=>{
    res.send(result)
   })
   .catch(err=>{
       error:err
   })
 
});

router.get('/mail/:email',(req, res)=>{
  Userdata.find({email: req.params.email}).populate('coverpic').populate('profilepic')
  .then(result=>{
     if(result){
    
      res.send(result)
     }
    })
    .catch(err=>{
        error:err
    })
  
 });

//  router.get('/delpost', (req, res)=>{
//   Userdata.find(req.body.email)
//   .then(result=>{
//        const x =result.map(item=> item.post).pop()
//        console.log(x)
//   })
//   .catch(err=>{
//    error:err
// })
    
// });



module.exports = router;