const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    id : String,
    dealer_id : Number,
    user_id : Number,
    service_id : [Number],
    status : Number,
    total_amount: Number,
    car_id : Number
},
{
    timestamps: true
});

module.exports = mongoose.model('order', OrderSchema);