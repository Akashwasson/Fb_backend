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

module.exports = mongoose.model('Introschema',intro_schema);