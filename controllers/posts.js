var bodyParser = require("body-parser");
var req = require('request');
var path = require('path');
const Post = require("../models/postModel");

exports.create = function (req, res) {
    // retrieve all data
    var identification = req.body.identification;
    var description = req.body.description;
    var username = req.body.username;
    var image = req.file.path.slice(6);
    var longitude = req.body.longitude;
    var latitude = req.body.latitude;

    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var year = now.getFullYear();
    var month = now.getMonth() + 1; // months are zero-based, so add 1
    var day = now.getDate();

    // format date
    var date = year + '-' + month + '-' + day;

    var post = new Post({
        identification: identification,
        description: description,
        username: username,
        date_posted: date,
        time_posted: `${hours}:${minutes}`,
        image: image,
        location: [longitude, latitude]
    });

    post.save(function (err, result) {
        if (err) {
            console.error('Error saving post:', err);
            return res.status(500).send('Error saving post');
        }

    });
};

exports.getAll = function (req, res) {
    // retrieve all posts from the database
    Post.find({}, function (err, posts) {
        if (err) {
            console.error('Error retrieving posts:', err);
            return res.status(500).send('Error retrieving posts');
        }

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(posts));
    });
};

