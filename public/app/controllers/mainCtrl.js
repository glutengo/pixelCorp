angular.module('mainCtrl', [])

.controller('mainController', function($rootScope, $location, Auth){

	var vm = this;

	console.log('mainCtrl');

	console.log(Auth.isLoggedIn());

	//get info if a persion is logged in
	vm.loggedIn = Auth.isLoggedIn();

	//check to see if a user is logged in on every request
	$rootScope.$on('$routeChangeStart', function(){
		vm.loggedIn = Auth.isLoggedIn();

		//get user information on route change
		Auth.getUser()
			.success(function(data){
				console.log('userData:');
				console.log(data);
				vm.user=data;
            
			});
	});

	//function to handle login form
	vm.doLogin = function(){

		vm.processing = true;

		//clear the error
		vm.error = '';

		//call the Auth.login() function
		Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function(data){

				vm.processing = false;
				//if a user succesfully logs in, redirect to users page
				if(data.success)
					$location.path('/developers');
				else vm.error = data.message;
			});
	};

	//function to handle logging out
	vm.doLogout = function(){
		Auth.logout();
		$location.path('/login');
	};
});