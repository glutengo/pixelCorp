angular.module('userApp', [
	'ngAnimate',
	'ngRoute',
    'ui.bootstrap',
	'app.routes',
	'authService',
    'dateService',
	'mainCtrl',
	'userCtrl',
	'userService',
    'developerService', 
    'developerCtrl',
    'singleDeveloperCtrl'
])

//application integration to integrate token into requests
.config(function($httpProvider){

	//attach our auth interceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');
})