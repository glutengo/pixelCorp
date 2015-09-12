//grab the packages that we need for the user model
var mongoose = require ('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

//user schema
var DeveloperSchema = new Schema({
		name: String,
	    slots: [{date: Date, amount: Number, pm: Schema.Types.Mixed}]
});

function compare(a,b) {
  if (a.date < b.date)
    return -1;
  if (a.date > b.date)
    return 1;
  return 0;
}

DeveloperSchema.methods.block = function(from,to,slots,pm){
    console.log("GET NEXT FREE DAY");
    var dev = this;
    var fromDate = new Date(from);
    var toDate = new Date(to);
    var thisDate = new Date();
    dev.slots = dev.slots.sort(compare);
     while(slots > 0){
        while(fromDate.getDay() == 0 || fromDate.getDay() == 6){
             fromDate = new Date(fromDate.getTime() + 24 * 60 * 60 * 1000);
        }
        if(fromDate.getTime() > toDate.getTime()){
            console.log("ERROR!");
            return null;
        }
        var found = false;
        dev.slots.forEach(function(slot){
            //check if there is an entry for the day and if so, if the day is not already full
            var datesEqual = (fromDate.getTime() == slot.date.getTime());
            var slotSpaces = 4-slot.amount;
            console.log("SLOT AMOUNT: " + slot.amount);
            if(datesEqual)found = true;
            if(datesEqual && slotSpaces > 0){
                var slotsToAdd = slots;
                if(slotsToAdd > slotSpaces) {
                    slotsToAdd = slotSpaces;
                }
                slots -= slotsToAdd;
                //check if pm exists and if so if entry for given pm exists
                 if(slot.pm){
                    if(slot.pm[pm]){
                        slot.pm[pm] += slotsToAdd; 
                    }
                    else{
                        slot.pm[pm] = slotsToAdd;
                    }
                 }
                else{
                    slot.pm = {}
                    slot.pm[pm] = slotsToAdd;
                }
                slot.amount += slotsToAdd;
            }
        });
        if(found == false){
            var slotsToAdd = slots;
            var slotSpaces = 4;
                if(slotsToAdd > slotSpaces) {
                    slotsToAdd = slotSpaces;
                }
            slots -= slotsToAdd;
            var slot = {
                date: fromDate,
                amount: slotsToAdd,
                pm:{}
            };
            slot.pm[pm] = slotsToAdd
            dev.slots.push(slot);
        }
        
        //check next day
        fromDate = new Date(fromDate.getTime() + 24 * 60 * 60 * 1000);
    }
   
    return slots;
    }

//return the model
module.exports = mongoose.model('Developer', DeveloperSchema);
 