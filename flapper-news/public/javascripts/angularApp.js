'use strict';
var app = angular.module('flapperNews', ['ui.router']);

app.factory('posts', ['$http', function($http){
  var o = {
    posts:[]
  };

  o.get = function(id){
    return $http.get('/posts/' + id).then(function(res){
      return res.data;
    });
  };

  o.getAll = function(){
    return $http.get('/posts').success(function(data){
      // .success = a binding function
      angular.copy(data, o.posts);
      // ^ ensures that the $scope.posts variable in MainCtrl will also be updated,
      // ensuring the new values are reflect in our view
      // unclear if this is not availing of angulars usual three way binding idea
    });
  };

  o.create = function(post){
    return $http.post('/posts', post).success(function(data){
      o.posts.push(data);
    });
  };

  o.upvote = function(post){
    return $http.put('posts/' + post._id + '/upvote' )
        .success(function(data){
          post.upvotes += 1;
        });
  };

  o.addComment = function(id, comment) {
    return $http.post('/posts/'+id+'/comments', comment);
  }

  o.upvoteComment = function(post, comment) {
    return $http.put('/posts/'+post._id+'/comments/'+comment._id+'/upvote')
        .success(function(data){
          comment.upvotes += 1;
        });
  };

  return o;
}]);


app.controller('MainCtrl', [
  '$scope',
  'posts',
  function($scope, posts){
    $scope.test = 'Hello world!';

    $scope.posts = posts.posts;

    $scope.addPost = function(){
      // catch null entries
      if(!$scope.title || $scope.title ===''){
        return;
      }

      posts.create({
        title: $scope.title,
        link: $scope.link
      });

      $scope.title = '';
      $scope.link = '';

    };

    $scope.incrementUpvotes = function(post) {
      posts.upvote(post);
    };

  }]);

app.controller('PostsCtrl', [
    '$scope',
    'posts',
    'post',
    function($scope, posts, post){

      $scope.post = post;

      $scope.addComment = function(){
        if($scope.body === '') { return; }
        posts.addComment(post._id, {
          body: $scope.body,
          author: 'user'
        }).success(function(comment){
          $scope.post.comments.push(comment);
        });
        $scope.body = '';
      };

      $scope.incrementUpvotes = function(comment){
        posts.upvoteComment(post, comment);
      };

    }
]);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('home', {
          url: '/home',
          templateUrl: '/home.html',
          controller: 'MainCtrl',
          resolve: {
            postPromise: ['posts', function(posts){
              return posts.getAll();
            }]
          }
        })
        .state('posts', {
          url: '/posts/{id}',
          templateUrl: '/posts.html',
          controller: 'PostsCtrl',
          resolve: {
            post: ['$stateParams', 'posts', function($stateParams, posts){
              return posts.get($stateParams.id);
            }]
          }
        });

    $urlRouterProvider.otherwise('home');
  }]);