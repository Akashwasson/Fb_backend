const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../DB');

// User Schema
const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  sex: {
    type: String,
    required: true
  },
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

module.exports.getUserByemail = function(email, callback){
  const query = {email: email}
  User.findOne(query, callback);
}

module.exports.resetPassword =  function(data,callback){

  const query ={email:data.email};
  User.findOne(query)
  .then(result=>{
  
    var isoDate = new Date(data.dob).toISOString();
    var isoDate1 = new Date(result.dob).toISOString()
  
    //when dob is correct
    if(isoDate1 == isoDate){
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(data.password, salt, (err, hash) => {
          if(err) throw err;
           data.password = hash;
          let datad={
            _id: result._id,
            firstName : result.firstName,
            lastName : result.lastName,
            email  :  result.email,
            dob   :   result.dob,
            password : data.password,
            sex   : result.sex
          }
          User.findOneAndUpdate(query,datad,{upsert:false,new:true},callback)
        });
      });
    }
    
  }) 
  .catch(err=>{
    error:err
})
  
}


module.exports.addUser = function(newUser, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}