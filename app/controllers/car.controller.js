const Cars = require('../models/car.model.js');

// Create and Save user details
 exports.create = (req, res) => {
 //Validate request
if(!req.body.model) {
    return res.status(400).send({
        message: "model can not be empty"
    });
}

// Create a user entry
const cars = new Cars({
    id : req.body.id,
    uid : req.body.uid,
    model : req.body.model,
    registration_number : req.body.registration_number
});
Cars.find({
    registration_number : req.body.registration_number
 })
 .then(car => {
       let response = {
        data: car,
        status: 200,
        statusCode:1,
        message:'Car with this registration number is already exist'
 };
 if( ! car || car.length == 0 ) {
     response.data = null;
     response.status= 404;
     response.statusCode = 0;
         // Save entry in the database
         cars.save()
        .then(data => {
         res.send(data);
         }).catch(err => {
         res.status(500).send({
        message: err.message || "Some error occurred while creating car details."
        });
     });
 }
 else {
   response.data = car[0];
   throw new Error(response.message);
 }
}).catch(err => {
 console.log('err = ',err);
 return res.status(500).send({
     message: 'Car with this registration number is already exist'
  });
});
};

// Retrieve and return all entries from the database.
exports.findAll = (req, res) => {
    Cars.find()
    .then(cars => {
        res.send(cars);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving car details."
        });
    });
};
exports.findbyuser = (req, res) => {
    Cars.find(
        {uid : req.body.uid}
        )
    .then(car => {
        let response = {
            data: car,
            status: 200,
            statusCode:1,
            message:'Success'
        };
        console.log('car = ',car);
        if(! car || car.length == 0) {
            response.data = null;
            response.status= 404;
            response.statusCode = 0;
            response.message = "Car not found with id " + req.params.uid;
            return res.status(404).send(response);            
        }
        res.send(response);
    }).catch(err => {
        console.log('err = ',err);
        return res.status(500).send({
            message: "Error retrieving Car with id " + req.params.uid
        });
    });
};
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.model) {
        return res.status(400).send({
            message: "model can not be empty"
        });
    }

    // Find userTypes and update it with the request body
    Cars.findByIdAndUpdate(req.params._id, {
        user_id : req.body.user_id,
        model : req.body.model,
        registration_number : req.body.registration_number
    }, {new: true})
    .then(car => {
        if(!car) {
            return res.status(404).send({
                message: "Car not found with id " + req.params._id
            });
        }
        res.send(car);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Car not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Error updating car with id " + req.params._id
        });
    });
};
exports.delete = (req, res) => {
    Cars.findByIdAndRemove(req.params._id)
    .then(car => {
        if(!car) {
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