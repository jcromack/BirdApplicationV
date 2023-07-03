const express = require('express');
const router = express.Router();
var post = require('../controllers/posts');
var multer = require('multer');
const Post = require('../models/postModel');
const Chat = require('../models/chatModel');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        var original = file.originalname;
        var file_extension = original.split(".");
        filename =  Date.now() + '.' + file_extension[file_extension.length-1];
        cb(null, filename);
    }
});
var upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function(req, res) {
    res.render('login', { title: 'Login'});
});

// Handle GET requests to the home page
router.get('/home', async function(req, res, next) {
    const posts = await Post.find({});
    const username = req.query.username;
    res.render('homepage', { title: 'Home', username: username, posts: posts });
});

router.get('/viewbirds', function(req, res) {
    res.render('viewbirds', { title: 'Viewbirds'});
  });

router.get('/myposts', async function(req, res, next) {
    const username = req.query.username;
    const posts = await Post.find({ username: username });
    res.render('myposts', { title: 'My Posts', username: username, posts: posts });
  });


router.get('/createpost', function(req, res, next) {
    const username = req.query.username;
    res.render('createpost', { title: 'Create Post', username: username });
});

router.post('/createpost', upload.single('myImg'), function(req, res) {
    post.create(req, res);
    res.redirect('/home')
});

router.get('/chatroom', function(req, res, next) {
    res.render('chatroom', { title: 'My Chat' });
});

router.get('/test', function(req, res, next) {
    res.render('test', { title: 'My Chat' });
});

router.get('/viewpost/:id', function(req, res, next) {
    const postId = req.params.id;

    // Find the post by ID
    Post.findById(postId)
        .then(post => {
            // Find all chat objects related to the post ID
            Chat.find({ postId: postId })
                .then(chats => {
                    res.render('viewpost', { title: 'Post', post: post, chats: chats, username: req.query.username });
                })
                .catch(err => {
                    console.error(err);
                    next(err);
                });
        })
        .catch(err => {
            console.error(err);
            next(err);
        });
});

var user = require('../controllers/user');
const mongoose = require("mongoose");
router.post('/login', function(req, res) {
    user.create(req, res);
});

router.get('/tester', function(req, res, next) {
    const username = req.query.username;
    res.render('tester', { title: 'Home', username: username });
});


router.get('/editpost', function(req, res, next) {
    const id = req.params.id;
    const username = req.params.username;
    res.render('editpost', { title: 'Create Post', username: username, id: id });


});

router.post('/editpost', function(req, res) {

    const updatedDesc = req.body.description;
    const updatedIDen = req.body.identification;

    const postId = req.body.id;
    const objectId = mongoose.Types.ObjectId(postId);


    // Find the post by ID and update its data
    Post.findById(objectId, function(err, foundPost) {
        console.log(foundPost)
        if (err) {
            console.error('Error:', err);
            // Handle the error here...
            res.redirect('/home');
        } else {
            // Update the post data
            foundPost.description = updatedDesc
            foundPost.identification = updatedIDen

            // Save the updated post
            foundPost.save(function(err) {
                if (err) {
                    console.error('Error:', err);
                    // Handle the error here...
                } else {
                    // Redirect to the home page or the post details page
                    res.redirect('/home');
                }
            });
        }
    });

});


module.exports = router;