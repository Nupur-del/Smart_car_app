const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    _id: Number,
    type: String,
    status: String
});

module.exports = mongoose.model('userTypes', UserSchema);