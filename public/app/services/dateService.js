angular.module('dateService', [])

.factory('DateHelper', function($http){
	
	//create a new object
	var dateFactory = {};

    dateFactory.month = function(month,year){
        var date = new Date();
        var monthname = "Januar";
        console.log('month...');
        switch(month){
            case 1:
                monthname = "Januar";
                break;
            case 2:
                monthname = "Februar";
                break;
            case 3:
                monthname = "März";
                break;
            case 4:
                monthname = "April";
                break;   
            case 5:
                monthname = "Mai";
                break;
            case 6:
                monthname = "Juni";
                break;
            case 7:
                monthname = "Juli";
                break;
            case 8:
                monthname = "August";
                break;
            case 9:
                monthname = "September";
                break;
            case 10:
                monthname = "Oktober";
                break;
            case 11:
                monthname = "November";
                break;
            case 12:
                monthname = "Dezember";
                break;
            default:
                monthname = "Januar";
                break;
            
        }
        var result = {
            name: monthname,
            days: [
            ]
        };
        for(var i=1; i<31; i++){
            var day = {
                date:null,
                amount:0
            };
            var date = new Date();
            date.setFullYear(year);
            date.setMonth(month-1);
            date.setDate(i);
            day.date = date;
            result.days.push(day);
        }
        console.log(result);
        while(result.days[0].date.getDay() != 1){
            var firstDay = {
                date:null,
                amount:0
            }; 
            var firstDate = new Date(new Date(result.days[0].date.getTime() - 24 * 60 * 60 * 1000));
            firstDay.date = firstDate;
            result.days.unshift(firstDay);
        }
        while(result.days[result.days.length-1].date.getDay() != 0){
            var lastDay = {
                date:null,
                amount:0
            };
            var lastDate = new Date(new Date(result.days[result.days.length-1].date.getTime() + 24 * 60 * 60 * 1000));
            lastDay.date = lastDate;
            result.days.push(lastDay);
        }
        return result;
    }

	//return our entire userFactory object
	return dateFactory;
})