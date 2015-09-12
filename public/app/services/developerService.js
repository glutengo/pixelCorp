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