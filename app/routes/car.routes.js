module.exports = (app) => {;

    const car = require('../controllers/car.controller.js');

    // Create a new UserType
    app.post('/cars', car.create);

    // Retrieve all userTypes
    app.get('/cars', car.findAll);

    // Retrieve a single usertype with id
    app.post('/cars_userid', car.findbyuser);

    // Update a usertype with id
    app.put('/cars/:_id', car.update);

    // Delete a usertype with id
    app.delete('/cars/:_id', car.delete);
}   