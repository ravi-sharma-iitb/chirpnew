var express = require('express');
var router = express.Router();
require('../models/models.js');
var mongoose = require('mongoose');
var User= mongoose.model('User');
var Post= mongoose.model('Post');


//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects

    //allow all get request methods
    if(req.method === "GET"){
    	//console.log('i got a get request');
        return next();
    }
    if (req.isAuthenticated()){
    	//console.log('i got isAuthenticated');
        return next();
    }
    console.log('checking isAuthenticated');
    // if the user is not authenticated then redirect him to the login page
    return res.redirect('/#login');
};

//Register the authentication middleware
router.use('/posts', isAuthenticated);

router.route('/posts')
    //creates a new post
    .post(function(req, res){
    	//console.log('just entered the post request');
        var post = new Post();
        post.text = req.body.text;
        post.created_by = req.body.created_by;
        post.save(function(err, post) {
            if (err){
            	//console.log('im having some error in saving posts');
                return res.send(500, err);
            }
           // console.log('just saving posts');
            return res.json(post);
        });
    })
    //gets all posts
    .get(function(req, res){
    	//console.log('i came here');
        Post.find(function(err, posts){
            if(err){
            	//console.log('im having some error in sending posts');
                return res.send(500, err);
            }

            //console.log(posts);
            return res.send(posts);
        });
    });

//post-specific commands. likely won't be used
router.route('/posts/:id')
    //gets specified post
    .get(function(req, res){
        Post.findById(req.params.id, function(err, post){
            if(err)
                res.send(err);
            res.json(post);
        });
    }) 
    //updates specified post
    .put(function(req, res){
        Post.findById(req.params.id, function(err, post){
            if(err)
                res.send(err);

            post.created_by = req.body.created_by;
            post.text = req.body.text;

            post.save(function(err, post){
                if(err)
                    res.send(err);

                res.json(post);
            });
        });
    })
    //deletes the post
    .delete(function(req, res) {
        Post.remove({
            _id: req.params.id
        }, function(err) {
            if (err)
                res.send(err);
            res.json("deleted :(");
        });
    });

module.exports = router;