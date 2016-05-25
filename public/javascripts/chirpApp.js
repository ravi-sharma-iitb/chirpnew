var app = angular.module('chirpApp', ['ngRoute','ngResource']).run(function($rootScope,$http) {
  $rootScope.authenticated = false;
  $rootScope.current_user = '';

  $rootScope.signout = function () {
    $http.get('/auth/signout');
    $rootScope.authenticated = false;
    $rootScope.current_user = '';
  };
  }
);

app.config(function($routeProvider){
  $routeProvider
    //the timeline display
    .when('/', {
      templateUrl: 'main.html',
      controller: 'mainController'
    })
    //the login display
    .when('/login', {
      templateUrl: 'login.html',
      controller: 'authController'
    })
    //the signup display
    .when('/register', {
      templateUrl: 'register.html',
      controller: 'authController'
    });
});

app.factory('postService',function ($resource) {
    return $resource('/api/posts/:id');
});

// angular socket part
app.factory('socket', function ($rootScope) {
  var socket = io.connect('http://localhost:3000');
  //socket.emit('alert','connected from app.js');
  socket.on('messagecheck',function (argument) {
    console.log('this is something i just passed '+argument);
  })
  console.log('socket running properly');
  /*socket.on('messagecheck',function (data) {
      console.log('here is the data is recieved from the server ' + data.text);
  });*/
  return {
    on: function (eventName, callback) {
            socket.on(eventName, function (data) {

                var args = arguments;
               // console.log('here is some arguments '+ data.text);
               // console.log(data.created_by);
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
    emit: function 
    (eventName, data) {
      socket.emit(eventName, data);
    }
  };
});

//angular socket part ends




app.controller('mainController',function($scope,postService,$rootScope,socket){
  $scope.posts = postService.query();
  //console.log(new Date.now());
  //obj={text:'',created_by:'',created_at:''};
 // console.log('im going to recieve the data');
  /*socket.on('messagecheck',function (data) {
    console.log('this is the incoming data from the server'+data);
  })*/
  socket.on('messagecheck',function (data) {
    obj={text:data.text,created_by:data.created_by};

   // obj.text = data.text;
    //obj.created_by = data.created_by;
    //obj.created_at = Date.now;
    console.log('post data    '+data);
     $scope.posts.push(obj);
  });
  $scope.newPost = {created_by:'',text:'',created_at:''};

 /* postService.getAll().success(function (data) {
    $scope.posts = data;
  });
*/
  $scope.post = function(){
      /*$scope.newPost.created_at = Date.now();
      $scope.posts.push($scope.newPost);
      $scope.newPost = {created_by: '', text: '', created_at: ''};
      */
      $scope.newPost.created_by = $rootScope.current_user;

      socket.emit('messagechange',$scope.newPost);

      postService.save($scope.newPost,function () {
        
         $scope.posts = postService.query();
         
         $scope.newPost = {created_by:'',text:'',created_at:''};
      });
  };

});
app.controller('authController', function($scope,$rootScope,$http,$location){
  $scope.user = {username: '', password: ''};
  $scope.error_message = '';

  

 $scope.login = function(){
    $http.post('/auth/login', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };

  $scope.register = function(){
    $http.post('/auth/signup', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };
});