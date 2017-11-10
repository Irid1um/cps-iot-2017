var http = require("http").createServer(handler); // on req - hand
var io = require("socket.io").listen(http); // socket library
var fs = require("fs"); // variable for file system for providing html
var firmata = require("firmata");

console.log("Starting the code");

var board = new firmata.Board("/dev/ttyACM0", function(){
    console.log("Enabling analog Pin 0");
    board.pinMode(0, board.MODES.ANALOG); // analog pin 0
    console.log("Enabling analog Pin 1");
    board.pinMode(1, board.MODES.ANALOG); // analog pin 1
});

function handler(req, res) {
    fs.readFile(__dirname + "/ex10.html",
    function (err, data) {
        if (err) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            return res.end("Error loading html page.");
        }
    res.writeHead(200);
    res.end(data);
    })
}

http.listen(8080); // server will listen on port 8080

var actualValue = 0; // variable for actual value (output value)
var desiredValue = 0; // desired value var
var sendValueViaSocket = function(){};

board.on("ready", function() {
    board.analogRead(0, function(value) {
        desiredValue = value; // continuous read of pin A0
    });
    board.analogRead(1, function(value) {
        actualValue = value; // continuous read of pin A0
    });
    
    
    io.sockets.on('connection', function(socket) {  // from bracket ( onward, we have an argument of the function on -> at 'connection' the argument is transfered i.e. function(socket)
    socket.emit("messageToClient", "Server connected, board ready.");
    setInterval(sendValues, 40, socket); // na 40ms we send message to client
}); // end of socket

                
    
}); // end of board.on ready

function sendValues (socket) {
    socket.emit("clientReadValues",
    { // json notation between curly braces
    "desiredValue": desiredValue,
    "actualValue": actualValue
    });
};