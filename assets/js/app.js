/*
* Copyright (c) 2015, Cristian Ramirez Rosas, Copyright Holder All Rights Reserved.
*/
(function() {
  'use strict';
  angular.module('app', [
  // Angular libraries
  'ui.router',
  'ngAnimate',
  // Foundation UI components
  'foundation',
  // Routing with front matter
  'foundation.dynamicRouting',
  // Transitioning between views
  'foundation.dynamicRouting.animations',
  'ezfb',
  'hljs'
  ])
  .config(function config($urlRouterProvider, $locationProvider, $stateProvider,ezfbProvider) {
    // Default to the index view if the URL loaded is not found
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl',
        animation: {
          enter: 'slideInDown',
          leave: 'fadeOut'
        }
      })
      .state('nosotros', {
        url: '/nosotros',
        templateUrl: 'templates/nosotros.html',
        controller: 'nosotrosCtrl',
        animation: {
          enter: 'slideInDown',
          leave: 'fadeOut'
        }
      })
      .state('contacto', {
        url: '/contacto',
        templateUrl: 'templates/contacto.html',
        controller: 'contactoCtrl',
        animation: {
          enter: 'slideInDown',
          leave: 'fadeOut'
        }
      });
    // Use this to enable HTML5 mode
    $locationProvider.html5Mode({
    enabled: false,
    requireBase: false
    });
    // Use this to set the prefix for hash-bangs
    // Example: example.com/#!/page
    $locationProvider.hashPrefix('!');
    /**
     * Basic setup
     *
     * https://github.com/pc035860/angular-easyfb#configuration
     */
    ezfbProvider.setInitParams({
      appId: '1650678135206332'
    });
  })
})();

/*
* Copyright (c) 2015, Cristian Ramirez Rosas, Copyright Holder All Rights Reserved.
*/
angular.module("app")
.controller("homeCtrl", function ($scope, $stateParams, $state, $controller, ezfb, $window, $location) {
  //angular.extend(this, $controller('DefaultController', {$scope: $scope, $stateParams: $stateParams, $state: $state}));
  $scope.keyword = [];
  updateLoginStatus(updateApiMe);

  $scope.login = function () {
    /**
     * Calling FB.login with required permissions specified
     * https://developers.facebook.com/docs/reference/javascript/FB.login/v2.0
     */
    ezfb.login(function (res) {
      /**
       * no manual $scope.$apply, I got that handled
       */
      if (res.authResponse) {
        updateLoginStatus(updateApiMe);
      }
    }, {scope: 'email,user_likes'});
  };

  $scope.logout = function () {
    /**
     * Calling FB.logout
     * https://developers.facebook.com/docs/reference/javascript/FB.logout
     */
    ezfb.logout(function () {
      updateLoginStatus(updateApiMe);
    });
  };

  $scope.share = function () {
    ezfb.ui(
      {
        method: 'feed',
        name: 'angular-easyfb API demo',
        picture: 'http://plnkr.co/img/plunker.png',
        link: 'http://plnkr.co/edit/qclqht?p=preview',
        description: 'angular-easyfb is an AngularJS module wrapping Facebook SDK.' +
                     ' Facebook integration in AngularJS made easy!' +
                     ' Please try it and feel free to give feedbacks.'
      },
      function (res) {
        // res: FB.ui response
      }
    );
  };

  /**
   * For generating better looking JSON results
   */
  var autoToJSON = ['loginStatus', 'apiMe'];
  angular.forEach(autoToJSON, function (varName) {
    $scope.$watch(varName, function (val) {
      $scope[varName + 'JSON'] = JSON.stringify(val, null, 2);
    }, true);
  });

  /**
   * Update loginStatus result
   */
  function updateLoginStatus (more) {
    ezfb.getLoginStatus(function (res) {
      $scope.loginStatus = res;

      (more || angular.noop)();
    });
  }

  /**
   * Update api('/me') result
   */

  function updateApiMe () {
    ezfb.api('/'+$scope.dependencia+"?fields=feed", function (res) {
      $scope.apiMe = res;
    });
  }
  $scope.addClave = function(){
    $scope.keyword.push($scope.clave);
  }
  $scope.updateApiMe = function() {
   ezfb.api('/'+$scope.dependencia+"?fields=feed", function (res) {

     var more = res.feed.paging.next;
     var next = isNext(more.substring(more.indexOf("feed"),more.length));

     $scope.apiMe = res;
     $scope.msg = [];
     $scope.filter = [];
     for(var key in res.feed.data){
       $scope.msg.push(res.feed.data[key].message);
     }
    //  for(var key in next.feed.data){
    //    $scope.msg.push(next.feed.data[key].message);
    //  }
    if($scope.keyword.length != 0){
     for(var key in $scope.msg){
       for(var key2 in $scope.keyword){
         console.log($scope.msg[key].indexOf($scope.keyword[key2]));
         if($scope.msg[key].indexOf($scope.keyword[key2]) != -1)
            $scope.filter.push($scope.msg[key]);
       }
     }
   }
   else {
     $scope.filter = $scope.msg;
   }

   });
 }
 function isNext(url){
   ezfb.api('/'+$scope.dependencia+'/'+url, function (res) {
     return res;
   });
 }
})
.controller("nosotrosCtrl", function ($scope, $stateParams, $state, $controller) {
  angular.extend(this, $controller('DefaultController', {$scope: $scope, $stateParams: $stateParams, $state: $state}));

})
.controller("contactoCtrl", function ($scope, $stateParams, $state, $controller) {
  angular.extend(this, $controller('DefaultController', {$scope: $scope, $stateParams: $stateParams, $state: $state}));

});
