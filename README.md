# bender-hipchat-bot

A simple hipchat bot which sends notifications to a hipchat room of your choice.

You need to know 3 things for this to work.

1. Your HipChat instance URL : ``` https://company.hipchat.com ```
2. The hipchat room ID : ``` https://company.hipchat.com/rooms?t=mine ```
3. The notification token for the above room ``` https://company.hipchat.com/rooms/tokens/<room_id> ```

# Usage
* Do ``` npm install ```
* Run as ``` node main.js ```
* If you want to run it in the background, ``` nohup node main.js & ```

# Links
* https://www.hipchat.com/docs/apiv2