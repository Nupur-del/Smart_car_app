const mongoose = require('mongoose');

const CarSchema = mongoose.Schema({
    id : Number,
    uid : Number,
    model : String,
    registration_number : 
    { type: String,
      unique : true
    }
});

module.exports = mongoose.model('car', CarSchema);