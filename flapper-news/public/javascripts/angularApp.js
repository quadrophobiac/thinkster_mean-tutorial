'use strict';
var app = angular.module('flapperNews', ['ui.router']);

app.factory('posts', ['$http', function($http){
  var o = {
    posts:[]
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

      $scope.posts.push({
        title: $scope.title,
        link: $scope.link,
        upvotes: 0,
        comments: [
          {author: 'Joe', body: 'Cool post!', upvotes: 0},
          {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
        ]
      });
      $scope.title = '';
      $scope.link = '';

    };

    $scope.incrementUpvotes = function(post) {
      post.upvotes += 1;
    }
  }]);

app.controller('PostsCtrl', [
    '$scope',
    '$stateParams',
    'posts',
    function($scope, $stateParams, posts){

      $scope.post = posts.posts[$stateParams.id];

      $scope.addComment = function(){
        if($scope.body === '') { return; }
        $scope.post.comments.push({
          body: $scope.body,
          author: 'user',
          upvotes: 0
        });
        $scope.body = '';

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
          controller: 'PostsCtrl'
        });

    $urlRouterProvider.otherwise('home');
  }]);