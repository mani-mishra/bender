// Require them modules
var readline = require('readline');
var restler = require('restler');
var CronJob = require('cron').CronJob;
var quotesArray = [];

// Constants specifc to your hipchat instances
const HIPCHAT_ROOM_ID = "myawesomeroomid"; // Find out your room ID
const HIPCHAT_ROOM_TOKEN = "mysupersecrettoken"; // Token generated for above room, Have a look at readme as to how to get yours
const HIPCHAT_BASE_URL = "https://mycompany.hipchat.com";
const HIPCHAT_ROOM_NOTIFICATION_API = '/v2/room/' + HIPCHAT_ROOM_ID + '/notification?auth_token=' + HIPCHAT_ROOM_TOKEN;

HipChat = restler.service(function(u, p) {
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
  // When the array is fully filled, start the cron job to send notifications
  // Below cron tab pattern runs from monday to friday from 10 AM to 10 PM at 2 hours interval.
  new CronJob('00 00 10,12,14,16,18,20,22 * * 1-5',blowTheTrumpet , null, true, 'Asia/Kolkata');
});

// select a random quote from array and send it as a payload to Hipchat API
var blowTheTrumpet = function() {
  var randomQuote = quotesArray[Math.floor(Math.random() * quotesArray.length)];
  var payload = {
    notify: true, // notifies the user about the message
    message: randomQuote 
  };
  console.log("Sending quote:" + JSON.stringify(payload));
  notSlack.sendRoomNotifications(payload).on('complete', function(data, response) {
    console.log(data);
  });
};