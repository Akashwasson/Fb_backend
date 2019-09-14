const mongoose = require('mongoose');

const friendrequest = mongoose.Schema({
    email:  {type: String},
    sentto: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Userdata' }],
})

module.exports = mongoose.model('Friendrequest', friendrequest);