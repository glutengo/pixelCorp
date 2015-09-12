angular.module('developerCtrl', ['developerService'])
.controller('developerController', function(Developer){

	var vm = this;

	//set a proessing variable to show loading things
	vm.processing = true;

	//grab all users at page load
	Developer.all()
		.success(function(data){

			//when all the users come back, remove the processing varable
			vm.processing = false;

			//bind the users that come back to vm.users
			vm.developers = data;
		});
    
    vm.block = function(developer){
        
        console.log("BLOCK");
        
        //today, sat 2015/09/12
        var from = new Date("2015-09-12T21:59:59+00:00");
        //2015/09/20
        var to = new Date("2015-09-20T21:59:59+00:00");
        console.log(from);
        console.log(to);
        //6 blocks. expected: at first: Saturday(2) and Sunday(full). Later: Monday (full) and Tuesday (2)
        var blocks = 8;
        Developer.block(developer,from,to,blocks);
        
    }

})
