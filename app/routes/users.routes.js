module.exports = (app) => {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
        next();
    });
    const user = require('../controllers/users.controller.js');

    // Create a new UserType
    app.post('/users', user.create);

    // Retrieve all userTypes
    app.get('/users', user.findAll);

    // Update a usertype with id
    app.post('/userid', user.update);

    // Delete a usertype with id
    app.delete('/users/:_id', user.delete);
 
    app.post('/users_credentials', user.login);

}   