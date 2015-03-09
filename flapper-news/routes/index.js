var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

// create route that preloads post objects

router.param('post', function(req, res, next, id){

  // when we define a route URL with :post in it, this function will be run first
  // NOTE tutorial defines this as a middleware function

  var query = Post.findById(id);
  // avail of mongoose's query interface

  query.exec(function(err, post){

    if(err){ return next(err); }
    if(!post){ return next(new Error('can\'t find post')); }

    req.post = post;
    return next();
  });

});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*GET: view all posts */
//
router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts){
    if(err){ return next(err); }

    res.json(posts);
  });
});

/* GET - a single post */

router.get('/posts/:post', function(req, res){
  res.json(req.post);
});

/* POST: add data to database */

router.post('/posts', function(req, res, next){
  var post = new Post(req.body);

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });

});

/* PUT add upvotes to a post */

router.put();

module.exports = router;