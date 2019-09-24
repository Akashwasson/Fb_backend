const mongoose =require('mongoose');

const post_Schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Userdata' }],
    text_post:{type:String, default:""},
    image: { type: String, default:"" },
    profilepic: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profilepic' }],
    username:String,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }]

});

module.exports = mongoose.model('Post', post_Schema);
