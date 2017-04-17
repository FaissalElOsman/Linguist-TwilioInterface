var path = require('path');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var twilio = require('twilio');

// Create a Twilio REST API client for authenticated requests to Twilio
var client = twilio("AC1cd2df05d94d3c79efc1b53da08e6bfa", "2ecc00df9bafcc8ba5f70a75d212b58c");
var app = express();
app.set('port', (process.env.PORT || 5100));
app.use(bodyParser.json());
app.listen(app.get('port'), function() {
    console.log('LOG INFO - index.js : Node app is running on port ' + app.get('port'));
});
// Configure application routes
    // Handle an AJAX POST request to place an outbound call
    app.post('/call', function(request, response) {
        // This should be the publicly accessible URL for your application
        // Here, we just use the host for the application making the request,
        // but you can hard code it or use something different if need be
        var url = 'http://localhost:5100/outbound/' + encodeURIComponent("+33982289345");

        // Place an outbound call to the user, using the TwiML instructions
        // from the /outbound route
        client.makeCall({
            to: "+33982289345",
            from: "+33627443544",
            url: url
        }, function(err, message) {
            console.log(err);
            if (err) {
                response.status(500).send(err);
            } else {
                response.send({
                    message: 'Thank you! We will be calling you shortly.'
                });
            }
        });
    });

    // Return TwiML instuctions for the outbound call
    app.post('/outbound/:salesNumber', function(request, response) {
        var salesNumber = request.params.salesNumber;
        var twimlResponse = new twilio.TwimlResponse();

        twimlResponse.say('Thanks for contacting our sales department. Our ' +
                          'next available representative will take your call. ',
                          { voice: 'alice' });

        twimlResponse.dial(salesNumber);

        response.send(twimlResponse.toString());
});