// includes and initiallization
var tconfig = require('./config.js').twitter || {};
var cconfig = require('./config.js').circonus || {};
var Twit = require('twit');
var fs = require('fs');
var https = require('https');

var request = require('request');

var twit = new Twit({
    consumer_key: tconfig.api_key,
    consumer_secret: tconfig.api_secret,
    access_token: tconfig.access_token,
    access_token_secret: tconfig.access_token_secret
});

var last_id;

// main
fs.readFile('.last_id', 'utf8', function (err,last_id) {
    if (err) {
      return console.log(err);
    }

    twit.get('/statuses/user_timeline', { screen_name: tconfig.username, 
                                          exclude_replies: tconfig.exclude_replies || true,
                                          include_rts: tconfig.include_rts || false,
                                          since_id: last_id || tconfig.since_id,
                                          count: tconfig.count || 200,
                                          trim_user: tconfig.count || false
                                        },  function (err, data, response) {
        if (err) {
            console.log(err);
        } else {
            var id;
            for (var i = 0; i < data.length; i++) {
                var status = data[i];

                // keep track highest id (latest tweet)
                if (!id || status.id > id) id = status.id;

                // only process if new or newer
                if (last_id != id) {

                    request.put(
                        cconfig.data_submission_url,
                        { form: JSON.stringify({ tweet: status.text + '\n' + status.created_at,
                          followers_count: status.user.followers_count
                         }) },
                        function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                            //    console.log(body);
                            } else {
                                console.log(error);
                                console.log(response.statusCode);
                            }
                        }
                    );

                }
            }
            // only store if new
            if (last_id != id)  {
              fs.writeFile('.last_id', id, 'utf8', function (err) {
                if (err) return console.log(err);
              });
            } else {
                console.log("pushing count");
                // just push follower count
                    request.put(
                        cconfig.data_submission_url,
                        { form: JSON.stringify({ 
                          followers_count: status.user.followers_count
                         }) },
                        function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                            //    console.log(body);
                            } else {
                                console.log(error);
                                console.log(response.statusCode);
                            }
                        }
                    );
                console.log("Followers: " + status.user.followers_count);
            } 
        }
        
    });
});


