var express     = require('express');
var bodyParser  = require('body-parser');
var twilio      = require('twilio');

var client = twilio("AC1cd2df05d94d3c79efc1b53da08e6bfa", "2ecc00df9bafcc8ba5f70a75d212b58c");
var app = express();
app.set('port', (process.env.PORT || 5100));
app.use(bodyParser.json());
app.listen(app.get('port'), function() {});

app.post('/call', function(request, response) {

    var url = 'https://linguist-twilio.herokuapp.com/outbound/' + encodeURIComponent("+33627443544");

    client.makeCall({to: "+33612112499", from: "+33627443544", url: url}, function(err, message) {
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

app.post('/outbound/:salesNumber', function(request, response) {
    var salesNumber = request.params.salesNumber;
    var twimlResponse = new twilio.TwimlResponse();

    twimlResponse.say('Thanks for contacting our sales department. Our next available representative will take your call. ',{ voice: 'alice' });
    twimlResponse.dial(salesNumber);
    response.send(twimlResponse.toString());
});