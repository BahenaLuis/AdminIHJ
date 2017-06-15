'use strict';

/**
 * @ngdoc overview
 * @name proyectoBaseAngularJsApp
 * @description
 * # proyectoBaseAngularJsApp
 *
 * Main module of the application.
 */
angular
  .module('proyectoBaseAngularJsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'ngFileUpload',
    'firebase'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      /*.when('/', {
        templateUrl: 'views/events.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })*/
      .when('/events', {
        templateUrl: 'views/events.html',
        controller: 'EventsCtrl',
        controllerAs: 'vm'
      })
      .when('/news', {
        templateUrl: 'views/news.html',
        controller: 'NewsCtrl',
        controllerAs: 'vm'
      })
      .when('/galery', {
        templateUrl: 'views/galery.html',
        controller: 'GaleryCtrl',
        controllerAs: 'vm'
      })
      .when('/directory', {
        templateUrl: 'views/directory.html',
        controller: 'DirectoryCtrl',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/news'
      });


       var config = {
        apiKey: "AIzaSyB50gMW1fXyvNi5IcUexXiw091hxnfxaBw",
        authDomain: "ihjs-145004.firebaseapp.com",
        databaseURL: "https://ihjs-145004.firebaseio.com",
        projectId: "ihjs-145004",
        storageBucket: "ihjs-145004.appspot.com",
        messagingSenderId: "751441911514"
      };
      firebase.initializeApp(config);
  });
