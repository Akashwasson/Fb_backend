const mongoose = require('mongoose');

const comment_schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Userdata' }],
    comment_post:{type:String,  required: true },
     post_id: { type: mongoose.Schema.Types.ObjectId, ref:'Post', required:true},

});

module.exports= mongoose.model('Comment',comment_schema);