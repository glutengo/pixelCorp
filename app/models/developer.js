//grab the packages that we need for the user model
var mongoose = require ('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

//user schema
var DeveloperSchema = new Schema({
		name: String,
	    slots: [{date: Date, amount: Number}]
});

DeveloperSchema.methods.blockNextFreeDay = function(from,blocks){
    console.log("GET NEXT FREE DAY");
    var dev = this;
    console.log(dev);
    var fromDate = new Date(from);
    var thisDate = new Date();
    for(var i=0; i<dev.slots.length; i++){
        thisDate = dev.slots[i].date;
        var datesEqual = (fromDate.getTime() == thisDate.getTime());
        if(datesEqual && dev.slots[i].amount < 4){
            console.log('free slots'); 
            if(blocks > 4-dev.slots[i].amount){
                dev.slots[i].amount = 4;
                blocks -= 4;
                return blocks;
            }
            else{
                dev.slots[i].amount += blocks;
                blocks = 0;
                return blocks;
            }
        }
    }
    var nextDay = new Date(thisDate.getTime() + 24 * 60 * 60 * 1000); 
    if(blocks > 4){
        dev.slots.push({
            date: nextDay,
            amount: 4
        });
        blocks -= 4;
    }
    else{
        dev.slots.push({
            date: nextDay,
            amount: blocks
        })
        blocks = 0;
    }
    return blocks;
    }

//return the model
module.exports = mongoose.model('Developer', DeveloperSchema);
 