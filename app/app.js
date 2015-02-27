'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('flapperNews', ['ngRoute']);

app.controller('MainCtrl', ['$scope', function($scope){
  $scope.test = 'Hello World';
  $scope.posts = [
    'post 1',
    'post 2',
    'post 3',
    'post 4',
    'post 5'
  ];
}]);
