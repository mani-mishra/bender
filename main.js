// Require them modules
var readline = require('readline');
var restler = require('restler');
var CronJob = require('cron').CronJob;
var quotesArray = [];

// Constants specifc to your hipchat instances
const HIPCHAT_ROOM_ID = "2464549"; // Find out your room ID
const HIPCHAT_ROOM_TOKEN = "vxeo4D29vsUlHb2HGjvIlSLIusCsqf814mHb0hvA"; //"mysupersecrettoken"; // Token generated for above room, Have a look at readme as to how to get yours
const HIPCHAT_BASE_URL = "fireeye-cloud.hipchat.com" ; //https://mycompany.hipchat.com";
const HIPCHAT_ROOM_NOTIFICATION_API = '/v2/room/' + HIPCHAT_ROOM_ID + '/notification?auth_token=' + HIPCHAT_ROOM_TOKEN;
// Interval to send the room notifications
const NOTIFICATION_INTERVAL = 2 * 60 * 60 * 1000; // in milliseconds


var HipChat = restler.service(function(u, p) {
  this.defaults.username = u;
  this.defaults.password = p;
}, {
  baseURL: HIPCHAT_BASE_URL
}, {
  sendRoomNotifications: function(message) {
    return this.post(HIPCHAT_ROOM_NOTIFICATION_API, {
      data: JSON.stringify(message),
      headers: {
        "content-type": "application/json"
      }
    });
  }
});

var notSlack = new HipChat();

// Create a line reader object 
var lineReader = readline.createInterface({
  input: require('fs').createReadStream('quotes.txt')
});

// Push every line terminated by newline character in to the array
// This is done once when the program is first run, so all the quotes are in memory
lineReader.on('line', function(line) {
  quotesArray.push(line);
});

lineReader.on('close', function() {
  console.log('Length of array is ' + quotesArray.length);
  blowTheTrumpet();
  var interval = setInterval(blowTheTrumpet, NOTIFICATION_INTERVAL);
});


// select a random quote from array and send it as a payload to Hipchat API
var blowTheTrumpet = function() {
  var randomQuote = quotesArray[Math.floor(Math.random() * quotesArray.length)];
  var payload = {
    notify: true, // Notifies 
    message: randomQuote 
  };
  console.log("Sending quote:" + JSON.stringify(payload));
  notSlack.sendRoomNotifications(payload).on('complete', function(data, response) {
    console.log(data);
  });
};

var job = new CronJob({
  cronTime: '00 30 10,13,16,19,22 * * 1-5', // Runs every weekday (Mon to Fri) starting from 10:30 AM to 10:30 PM, at 3 hours interval
  onTick: blowTheTrumpet,
  start: true, /* Start the job right now */
  timeZone: 'Asia/Kolkata' /* Time zone of this job. */
});

job.start();