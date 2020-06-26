module.exports = (app) => {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
        next();
    });
    const userTypes = require('../controllers/usertype.controller.js');

    // Create a new UserType
    app.post('/userTypes', userTypes.create);

    // Retrieve all userTypes
    app.get('/userTypes', userTypes.findAll);

    // Retrieve a single usertype with id
    app.get('/userTypes/:_id', userTypes.findOne);

    // Update a usertype with id
    app.put('/userTypes/:_id', userTypes.update);

    // Delete a usertype with id
    app.delete('/userTypes/:_id', userTypes.delete);
}   