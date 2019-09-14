const mongoose = require('mongoose');
 
const basicdata = mongoose.Schema({  
    _id: mongoose.Schema.Types.ObjectId,
    userid:{ type: mongoose.Schema.Types.ObjectId, ref: 'Userdata'},
    coverpic: {type: String},
    Post:  { type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
});

module.exports = mongoose.model('Coverpic', basicdata);