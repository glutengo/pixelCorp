angular.module('developerService', [])

.factory('Developer', function($http){
	
	//create a new object
	var developerFactory = {};

	//get all users
	developerFactory.all = function(){
		return $http.get('/api/developers');
	};
    
	//get a single user
	developerFactory.get = function(id){
		return $http.get('/api/developers/' + id);
	};  
    
    developerFactory.block = function(developer, from, to, blocks,pm){
        //normalize dates
        from.setHours(12);
        from.setMinutes(0);
        from.setSeconds(0);
        from.setMilliseconds(0);
        to.setHours(12);
        to.setMinutes(0);
        to.setSeconds(0);
        to.setMilliseconds(0);
        var postData = {
            developer: developer,
            from: from,
            to: to,
            blocks: blocks,
            pm:pm
        }
        console.log(postData);
        return $http.post('/api/developers/block',postData);
    }

	//return our entire userFactory object
	return developerFactory;
}) 