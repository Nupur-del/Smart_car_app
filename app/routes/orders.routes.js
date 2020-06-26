module.exports = (app) => {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
        next();
    });
    const order = require('../controllers/orders.controller.js');

    // Create a new UserType
    app.post('/orders', order.create);

    // Retrieve all userTypes
    app.get('/orders', order.findAll);

    // Retrieve a single usertype with id
    app.post('/orders_userid', order.findbyUser);

    // Update a usertype with id
    app.put('/orders/:_id', order.update);

    // Delete a usertype with id
    app.delete('/orders/:_id', order.delete);
}   