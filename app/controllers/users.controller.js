const Users = require('../models/users.model.js');

// Create and Save user details
exports.create = (req, res) => {
 
//Validate request
if(!req.body.name) {
    return res.status(400).send({
        message: "name can not be empty"
    });
}
// Create a user entry
const users = new Users({
    uid : req.body.uid,
    name : req.body.name,
    gender : req.body.gender,
    address: req.body.address,
    email: req.body.email,
    mobile: req.body.mobile,
    password : req.body.password,
    user_type: req.body.user_type
});

    Users.find({email : req.body.email
    })
    .then(user => {
          let response = {
           data: user,
           status: 200,
           statusCode:1,
           message:'User already exist'
    };
    if( ! user || user.length == 0 ) {
        response.data = null;
        response.status= 404;
        response.statusCode = 0;
            // Save entry in the database
            users.save()
            .then(data => {
               res.send(data);
            }).catch(err => {
                res.status(500).send({
                message: err.message || "Some error occurred while creating users."
                });
            });
    }
    else {
      response.data = user[0];
      throw new Error(response.message);
    }
}).catch(err => {
    console.log('err = ',err);
    return res.status(500).send({
        message: 'User is already exist'
     });
   });
};

// Retrieve and return all entries from the database.
exports.findAll = (req, res) => {
    Users.find()
    .then(users => {
        let response = {
            data: users,
            status: 200,
            statusCode:1,
            message:'Success'
        };
        res.send(response);
    }).catch(err => {
        let response = {
            data: null,
            status: 500,
            statusCode:0,
            message: err.message || "Some error occurred while retrieving users."
        };
        res.status(500).send(response);
    });
};

exports.login = (req, res) => {
    Users.find({
        $and: [
            {email: req.body.username},
            {password : req.body.password }
        ]
    })
    .then(user=> {
        let response = {
            data: user,
            status: 200,
            statusCode:1,
            message:'Success'
        };
        console.log('user = ',user);
        if(!user || user.length == 0) {
            response.data = null;
            response.status= 404;
            response.statusCode = 0;
            response.message = "Not able to fetch the user";
            return res.status(404).send(response);            
        }
        response.data = user[0];
        res.send(response);
    }).catch(err => {
        console.log('err = ',err);
        return res.status(500).send({
            message: "Error occurred while fetch the user"
        });
    });
};
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.uid) {
        return res.status(400).send({
            message: "uid can not be empty"
        });
    }
    // Find userTypes and update it with the request body
    Users.findOne({
        uid : req.body.uid
    })
    .then(user => {
            let response = {   
            data: user,
            status: 200,
            statusCode:1,
            message: 'Success'
            };
            console.log('data =', user);
            Users.findByIdAndUpdate(user._id, {
                name : req.body.name,
                gender : req.body.gender
            })
            .then(user => {
                response = {   
                    data: null,
                    status: 200,
                    statusCode:1,
                    message: 'Success'
                    };
                    res.send(response);
            }).catch(err => {
                return res.status(500).send({
                    message: "Error updating order with id " + user._id
                });
            });
    }).catch(err => {
     console.log('err = ',err);
     return res.status(500).send({
         message: 'User does not exist'
      });
    });
};  
exports.delete = (req, res) => {
    Users.findByIdAndRemove(req.params._id)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params._id
            });
        }
        res.send({message: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Could not delete User with id " + req.params._id
        });
    });
};