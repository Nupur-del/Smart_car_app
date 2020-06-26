const Feedbacks = require('../models/feedbacks.model.js');

// Create and Save user details
 exports.create = (req, res) => {
 //Validate request
if(!req.body.order_id) {
    return res.status(400).send({
        message: "order_id can not be empty"
    });
}

// Create a user entry
const feedbacks = new Feedbacks({
    _id : req.body._id,
    order_id : req.body.order_id,
    feed_text : req.body.feed_text,
    feed_rating : req.feed_rating,
    user_id : req.body.user_id
});

// Save entry in the database
feedbacks.save()
.then(data => {
    res.send(data);
}).catch(err => {
    res.status(500).send({
        message: err.message || "Some error occurred while saving feedbacks."
    });
});
};

// Retrieve and return all entries from the database.
exports.findAll = (req, res) => {
    Feedbacks.find()
    .then(feeds => {
        res.send(feeds);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Feedbacks."
        });
    });
};
exports.findOne = (req, res) => {
    Feedbacks.findById(req.params._id)
    .then(feedback=> {
        if(!feedback) {
            return res.status(404).send({
                message: "Feedback not found with id " + req.params._id
            });            
        }
        res.send(feedback);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Feedback not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving Feedback with id " + req.params._id
        });
    });
};
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.order_id) {
        return res.status(400).send({
            message: "order_id can not be empty"
        });
    }

    // Find userTypes and update it with the request body
    Feedbacks.findByIdAndUpdate(req.params._id, {
        order_id : req.body.order_id,
        feed_text : req.body.feed_text,
        feed_rating : req.feed_rating,
        user_id : req.body.user_id
    }, {new: true})
    .then(feedback => {
        if(!feedback) {
            return res.status(404).send({
                message: "feedback not found with id " + req.params._id
            });
        }
        res.send(feedback);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "feedback not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Error updating feedback with id " + req.params._id
        });
    });
};
exports.delete = (req, res) => {
    Feedbacks.findByIdAndRemove(req.params._id)
    .then(feedback => {
        if(!feedback) {
            return res.status(404).send({
                message: "Feedback not found with id " + req.params._id
            });
        }
        res.send({message: "Feedback deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Feedback not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Could not delete feedback with id " + req.params._id
        });
    });
};