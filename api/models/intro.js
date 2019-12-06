const mongoose = require('mongoose');

const intro_schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email:  {type: String},
    describe: {type:String},
    work: {type:String},
    college: {type:String},
    school: {type:String},
    livesin: {type:String},
    from: {type:String},
    instagram: {type:String},
    mail: {type:String},
});

const introschema = module.exports = mongoose.model('Introschema',intro_schema);

module.exports.findbyemail = function(data, callback){
    var query = {email: data.email};
    introschema.findOne(query,callback) 
    .then(doc=>{
        if(doc){
            //   console.log("success11")
        }
        else{
            // console.log("failed")
        }
    })
    .catch(err=>{
        error:err
     })
}

module.exports.fillintro = function(data ,callback){
    var query = {email: data.email};
    var  datad = {
        _id: data._id,
         email: data.email,
         describe: data.describe,
         work: data.work,
         college: data.college,
         school: data.school,
         livesin: data.livesin,
         from: data.from,
         instagram: data.instagram,
         mail: data.mail
    }
    
    introschema.findOneAndUpdate(query,datad,{upsert:true, new:true},callback);
}