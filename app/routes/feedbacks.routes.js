module.exports = (app) => {
    const Feeds = require('../controllers/feedbacks.controller.js');

    // Create a new UserType
    app.post('/feedbacks', Feeds.create);

    // Retrieve all userTypes
    app.get('/feedbacks', Feeds.findAll);

    // Retrieve a single usertype with id
    app.get('/feedbacks/:_id', Feeds.findOne);

    // Update a usertype with id
    app.put('/feedbacks/:_id', Feeds.update);

    // Delete a usertype with id
    app.delete('/feedbacks/:_id', Feeds.delete);
}   