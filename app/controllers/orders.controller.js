const Orders = require('../models/orders.model.js');

// Create and Save user details
 exports.create = (req, res) => {
 //Validate request
if(!req.body.dealer_id) {
    return res.status(400).send({
        message: "dealer_id can not be empty"
    });
}

// Create a user entry
const orders = new Orders({
    id : req.body.id,
    dealer_id : req.body.dealer_id,
    user_id : req.body.user_id,
    service_id : req.body.service_id,
    status : req.body.status,
    total_amount : req.body.total_amount,
    car_id : req.body.car_id
});

// Save entry in the database
orders.save()
.then(data => {
    res.send(data);
}).catch(err => {
    res.status(500).send({
        message: err.message || "Some error occurred while creating orders."
    });
});
};

// Retrieve and return all entries from the database.
exports.findAll = (req, res) => {
    Orders.find()
    .then(orders => {
        res.send(orders);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving orders."
        });
    });
};
exports.findbyUser = (req, res) => {
    Orders.find(
        {user_id : req.body.uid}
        )
    .then(order => {
        let response = {
            data: order,
            status: 200,
            statusCode:1,
            message:'Success'
        };
        console.log('order = ',order);
        if(! order || order.length == 0) {
            response.data = null;
            response.status= 404;
            response.statusCode = 0;
            response.message = "No order Id found this user" + req.params.uid;
            return res.status(404).send(response);            
        }
        res.send(response);
    }).catch(err => {
        console.log('err = ',err);
        return res.status(500).send({
            message: "Error retrieving with userid" + req.params.uid
        });
    });
};
exports.findOne = (req, res) => {
    Orders.findById(req.params._id)
    .then(order=> {
        if(!order) {
            return res.status(404).send({
                message: "Order not found with id " + req.params._id
            });            
        }
        res.send(order);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Order not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving Order with id " + req.params._id
        });
    });
};
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.dealer_id) {
        return res.status(400).send({
            message: "dealer_id can not be empty"
        });
    }

    // Find userTypes and update it with the request body
    Orders.findByIdAndUpdate(req.params._id, {
        dealer_id : req.body.dealer_id,
        user_id : req.body.user_id,
        service_id : req.body.service_id,
        status : req.body.status,
        total_amount : req.body.total_amount,
        car_id : req.body.car_id
    }, {new: true})
    .then(order => {
        if(!order) {
            return res.status(404).send({
                message: "Order not found with id " + req.params._id
            });
        }
        res.send(order);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Order not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Error updating order with id " + req.params._id
        });
    });
};
exports.delete = (req, res) => {
    Orders.findByIdAndRemove(req.params._id)
    .then(order => {
        if(!order) {
            return res.status(404).send({
                message: "Order not found with id " + req.params._id
            });
        }
        res.send({message: "Order deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Order not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Could not delete Order with id " + req.params._id
        });
    });
};