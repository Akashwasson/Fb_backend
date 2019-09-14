const mongoose = require('mongoose')

const friendlist = mongoose.Schema({
    email:  {type: String},
    friendsid: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Userdata' }],
})

module.exports = mongoose.model('Friendlist', friendlist);