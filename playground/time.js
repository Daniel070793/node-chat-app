var moment = require("moment");

localTime = moment().format("LTS");
var test = moment.locale("da");
var date = moment().format("LTS");

// console.log(localTime);
// console.log(test);
//console.log(date.format("LTS"));
console.log(date);
