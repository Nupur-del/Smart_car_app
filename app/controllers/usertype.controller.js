const UserTypes = require('../models/usertype.model.js');

// Create and Save usertypes details
 exports.create = (req, res) => {
 //Validate request
if(!req.body.type) {
    return res.status(400).send({
        message: "type can not be empty"
    });
}

// Create a usetype entry
const userTypes = new UserTypes({
    _id : req.body._id,
    type: req.body.type || "Untitled type", 
    status: req.body.status
});

// Save entry in the database
userTypes.save()
.then(data => {
    res.send(data);
}).catch(err => {
    res.status(500).send({
        message: err.message || "Some error occurred while creating userTypes."
    });
});
};

// Retrieve and return all entries from the database.
exports.findAll = (req, res) => {
    UserTypes.find()
    .then(Types => {
        let response = {
            data: Types,
            status: 200,
            statusCode:1,
            message:'Success'
        };
        res.send(response);
    }).catch(err => {
        let response = {
            data: null,
            status: 200,
            statusCode: 0,
            message: err.message || 'Some error occurred while retrieving userTypes.'
        };
        res.status(500).send(response);
    });
};
exports.findOne = (req, res) => {
    UserTypes.findById(req.params._id)
    .then(userTypes=> {
        if(!userTypes) {
            return res.status(404).send({
                message: "UserType not found with id " + req.params._id
            });            
        }
        res.send(userTypes);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "UserType not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving UserType with id " + req.params._id
        });
    });
};
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.type) {
        return res.status(400).send({
            message: "type content can not be empty"
        });
    }

    // Find userTypes and update it with the request body
    UserTypes.findByIdAndUpdate(req.params._id, {
        type: req.body.type || "Untitled Type",
        status: req.body.status
    }, {new: true})
    .then(userTypes => {
        if(!userTypes) {
            return res.status(404).send({
                message: "UserTypes not found with id " + req.params._id
            });
        }
        res.send(userTypes);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "UserType not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Error updating userType with id " + req.params._id
        });
    });
};
exports.delete = (req, res) => {
    UserTypes.findByIdAndRemove(req.params._id)
    .then(userTypes => {
        if(!userTypes) {
            return res.status(404).send({
                message: "Usertypes not found with id " + req.params._id
            });
        }
        res.send({message: "Usertype deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "UserType not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Could not delete UserType with id " + req.params._id
        });
    });
};