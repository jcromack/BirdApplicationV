var bodyParser = require("body-parser");
var User = require('../models/user');
var path = require('path');

exports.create = function (req, res) {
    var userData = req.body;



    // Check if username already exists in the database
    User.findOne({ username: userData.username }, function (err, existingUser) {
        if (err) {
            res.status(500).send('An error has occurred!');
        } else if (existingUser) {
            // If the user already exists, redirect to 'home' with the username as a query parameter
            res.redirect('/home?username=' + encodeURIComponent(existingUser.username));
        } else {
            // If the user does not exist, create a new entry in the database and redirect to 'home'
            var user = new User({
                username: userData.username,
            });

            user.save(function (err, results) {
                if (err) {
                    res.status(500).send('An error has occurred!');
                } else {
                    res.redirect('/home?username=' + encodeURIComponent(user.username));
                }
            });
        }
    });

};
