angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider){

	$routeProvider

	//home page route
	.when('/', {
		templateUrl: 'app/views/pages/home.html'
	})

	.when('/login', {
		templateUrl: 'app/views/pages/login.html',
		controller: 'mainController',
		controllerAs: 'login'
	})

	.when('/users', {
		templateUrl: 'app/views/pages/users/all.html',
		controller: 'userController',
		controllerAs: 'user'
	})

	//form to create a new user
	//same view as edit page
	.when('/users/create', {
		templateUrl: 'app/views/pages/users/single.html',
		controller: 'userCreateController',
		controllerAs: 'user'
	})
    
    .when('/developers', {
        templateUrl: 'app/views/pages/developers.html',
        controller: 'developerController',
        controllerAs: 'developer'
    })
    ;

	//get rid of the hash in the URL
	$locationProvider.html5Mode(true);
});