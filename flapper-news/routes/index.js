var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

// create middleware route that preloads post objects

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


/* create middleware route for comment objects */
// benefit of this is that any requests made to the endpoint will return a comment
// id and make it available as either req or res variable

router.param('comment', function(req, res, next, id){

});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*GET: view all posts */
//
router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts){
    if(err){ console.log(err); return next(err); }

    res.json(posts);
  });
});

/* GET - a single post */

router.get('/posts/:post', function(req, res){
  res.json(req.post);
});

/* GET - comments for a single post */

router.get('/posts/:post/comments/', function(){});

/* GET an individual comment */
// when would this ever be needed??

router.get('', function(){});

/* POST: add post data to database */

router.post('/posts', function(req, res, next){
  var post = new Post(req.body);

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });

});

/* POST: add comments to a post */

router.post('/posts/:post/comments', function(req, res, next){

  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.save(function(err, comment){

    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err,post){
      if(err){ return next(err); }

      res.json(comment);
    });

  });

});

/* PUT add upvotes to a post */

router.put('posts/:post/upvote', function(req, res, next){
  req.post.upvote(function(err, post){
    if (err) {return next(err); }

    res.json(post);
  });
});

/* PUT: add upvotes to a comment */

router.put('/posts/:post/comments/:comment/upvote', function(req, res, next){
  // INCOMPLETE!
});

module.exports = router;