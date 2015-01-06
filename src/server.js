var http = require('http');
var url = require('url');
var querystring = require('querystring');
var Cylon = require('cylon'); // for libmraa
var fs = require('fs'); // to insert the html page

/*
 * The 3 transistors are connected on PWM GPIO here 14 , 20 and 21
 * Choose your pin on the mini breakout board with the manual : https://communities.intel.com/servlet/JiveServlet/downloadBody/23252-102-8-27632/edison-breakout_HG_331190-004.pdf 
 * And the libmraa man : http://iotdk.intel.com/docs/master/mraa/edison.html
 * 
 */
var redGpio = 14;
var blueGpio = 20;
var greenGpio = 0;

var server = http.createServer(function (req, res) {
    var params = querystring.parse(url.parse(req.url).query);
    var page = url.parse(req.url).pathname;
    console.log(page);


    if (page === '/change') { // if you are in /change page get the argument (red, blue or green)
        res.writeHead(200);
        if ('red' in params) {
            if (params['red'] > 255) {
                params['red'] = 255;
            }
            else if (params['red'] < 0) {
                params['red'] = 0;
            }
            var redLed = Cylon.robot({
                connections: {
                    edison: {adaptor: 'intel-iot'}
                },
                devices: {
                    led: {driver: 'led', pin: parseInt(redGpio)}},
                work: function (my) {

                    my.led.brightness(parseInt(params['red']));
                }
            });
            redLed.start();

            res.write(" Red : " + parseInt(params['red']));

        }

        if ('blue' in params) {
            if (params['blue'] > 255) {
                params['blue'] = 255;
            }
            else if (params['blue'] < 0) {
                params['blue'] = 0;
            }
            var blueLed = Cylon.robot({
                connections: {
                    edison: {adaptor: 'intel-iot'}
                },
                devices: {
                    led: {driver: 'led', pin: parseInt(blueGpio)}},
                work: function (my) {

                    my.led.brightness(parseInt(params['blue']));
                }
            });
            blueLed.start();

            res.write(" Blue : " + parseInt(params['blue']));
        }
        if ('green' in params) {
            if (params['green'] > 255) {
                params['green'] = 255;
            }
            else if (params['green'] < 0) {
                params['green'] = 0;
            }
            var greenLed = Cylon.robot({
                connections: {
                    edison: {adaptor: 'intel-iot'}
                },
                devices: {
                    led: {driver: 'led', pin: parseInt(greenGpio)}},
                work: function (my) {

                    my.led.brightness(parseInt(params['green']));
                }
            });
            greenLed.start();

            res.write(" Green : " + parseInt(params['green']));

        }
        res.end();

    }
    
    else { // nowhere you are show the html page and dialog with socketio
        fs.readFile('./index.html', 'utf-8', function (error, content) {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(content);
        });
    }

});

var io = require('socket.io').listen(server); // to dialog with the webpage

io.sockets.on('connection', function (socket) {

    socket.on('changeRed', function (value) {
        if (value > 255) {
            value = 255;
        }
        else if (value < 0) {
            value = 0;
        }
        var redLedIO = Cylon.robot({
            connections: {
                edison: {adaptor: 'intel-iot'}
            },
            devices: {
                led: {driver: 'led', pin: parseInt(redGpio)}},
            work: function (my) {

                my.led.brightness(parseInt(value));
            }
        });
        redLedIO.start();
		
        console.log('Red : ' + value);
    });
    socket.on('changeBlue', function (value) {
        if (value > 255) {
            value = 255;
        }
        else if (value < 0) {
            value = 0;
        }
        var blueLedIO = Cylon.robot({
            connections: {
                edison: {adaptor: 'intel-iot'}
            },
            devices: {
                led: {driver: 'led', pin: parseInt(blueGpio)}},
            work: function (my) {

                my.led.brightness(parseInt(value));
            }
        });
        blueLedIO.start();
		
        console.log('Blue : ' + value);
    });
    socket.on('changeGreen', function (value) {
        if (value > 255) {
            value = 255;
        }
        else if (value < 0) {
            value = 0;
        }
        var greenLedIO = Cylon.robot({
            connections: {
                edison: {adaptor: 'intel-iot'}
            },
            devices: {
                led: {driver: 'led', pin: parseInt(greenGpio)}},
            work: function (my) {

                my.led.brightness(parseInt(value));
            }
        });
        greenLedIO.start();
		
        console.log('Green : ' + value);
    });
});


server.listen(8080);


