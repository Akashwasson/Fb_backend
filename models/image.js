const mongoose =require('mongoose');

const image_Schema = mongoose.Schema({
   
    userid: String,
    filename : String,
    filetype: String,
    fileName: String
    
});

module.exports = mongoose.model('Image', image_Schema);