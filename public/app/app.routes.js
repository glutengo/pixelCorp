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
    
    .when('/developers', {
        templateUrl: 'app/views/pages/developers/all.html',
        controller: 'developerController',
        controllerAs: 'developer'
    })
    
    .when('/developers/single', {
        templateUrl: 'app/views/pages/developers/single.html',
        controller: 'singleDeveloperController',
        controllerAs: 'singleDeveloper'
    })
    
    .when('/developers/block', {
        templateUrl: 'app/views/pages/developers/block.html',
        controller: 'singleDeveloperController',
        controllerAs: 'singleDeveloper'
    })
    ;

	//get rid of the hash in the URL
	$locationProvider.html5Mode(true);
});