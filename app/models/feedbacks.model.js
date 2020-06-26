const mongoose = require('mongoose');

const FeedbackSchema = mongoose.Schema({
    _id : Number,
    order_id : String,
    feed_text : String,
    feed_rating : Number,
    user_id : Number
},
{
    timestamps: true
});

module.exports = mongoose.model('feedbacks', FeedbackSchema);