angular.module('singleDeveloperCtrl', ['developerService','dateService','userService'])
.controller('singleDeveloperController', function(Developer,DateHelper,$routeParams,$location,User){

	var vm = this;

    console.log($routeParams);
    
	//set a proessing variable to show loading things
	vm.processing = true;
    vm.processed = false;
    vm.dev_id = $routeParams.id;
    User.me().success(function(result){
        console.log("RESULT" +result);
        vm.username = result;
        console.log(vm.username);
    });
    vm.get = function(id,month,year){
    //grab all users at page load
	Developer.get(id)
		.success(function(data){
            console.log(data);
			//when all the users come back, remove the processing varable
            vm.month = DateHelper.month(month,year);
			//bind the users that come back to vm.users
			vm.dev = data;
            angular.forEach(vm.dev.slots, function(slot){
                console.log(slot);
                slot.date = new Date(slot.date);
                angular.forEach(vm.month.days, function(day){
                    if(slot.date.getDate() == day.date.getDate() &&
                       slot.date.getMonth() == day.date.getMonth() &&
                       slot.date.getYear() == day.date.getYear()){
                        day.amount = slot.amount;
                        day.pm = slot.pm;
                    }
                });
            });
		});	
    }
    
    vm.weekdays = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"]
    
    vm.get(vm.dev_id,9,2015);
    
    vm.block = function(developer){
        
        console.log("BLOCK");
        
        //today, sat 2015/09/12
        var from = vm.from;
        //2015/09/20
        var to = vm.to;
        console.log(from);
        console.log(to);
        //6 blocks. expected: at first: Saturday(2) and Sunday(full). Later: Monday (full) and Tuesday (2)
        var blocks = vm.slots;
        var pm = vm.username.name;
        console.log(vm.username);
        console.log(pm);
        console.log(blocks);
        var responseMessage = Developer.block(developer,from,to,blocks,pm);
        responseMessage.success(function(result){
            console.log(result);
            vm.errorMessage = result.message;
            vm.processed = true;
            if(result.code == 200){
                vm.success = true;
            }
            else{
                vm.success = false;
            }
        });
        console.log(responseMessage); 
        
    }
    
    vm.cancel = function(){
        vm.processed = false;
    }
    
    vm.errorMessage = "";
    vm.success = true;
    
    vm.showPopup = function(){
        vm.popupVisible = true;
    }
    
    vm.getNumber = function(day){
        console.log(day);
        return new Array(day);
    }
    
    vm.today = function() {
    vm.from = new Date();
        
  };
  vm.today();

  vm.clear = function () {
    vm.from = null;
      vm.to = null
  };

  // Disable weekend selection
  vm.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  vm.toggleMin = function() {
    vm.minDate = vm.minDate ? null : new Date();
  };
  vm.toggleMin();
  vm.maxDate = new Date(2020, 5, 22);
    vm.to = vm.maxDate;

  vm.open = function($event) {
    vm.status.opened = true;
  };
    
    vm.openTo = function($event){
             vm.status.toOpened = true;
 
    };

  vm.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  vm.format = vm.formats[0];

  vm.status = {
        opened: false,
      toOpened: false,
      isopen: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 2);
  vm.events =
    [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

  vm.getDayClass = function(date, mode) {
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i=0;i<vm.events.length;i++){
        var currentDay = new Date(vm.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return vm.events[i].status;
        }
      }
    }

    return '';
  };

})
