var http = require("http").createServer(handler); // on req - handler - function to handle events
var io = require("socket.io").listen(http); // socket library
var fs = require("fs"); // variable for file system for providing html
var firmata = require("firmata");

console.log("Starting the code");

var board = new firmata.Board("/dev/ttyACM0", function(){
    console.log("Connecting to Arduino");
    console.log("Activation of Pin 8");
    board.pinMode(8, board.MODES.OUTPUT); // Configures the specified pin to behave either as an input or an output.
    console.log("Activation of Pin 13");
    board.pinMode(13, board.MODES.OUTPUT); // Configures the specified pin to behave either as an input or an output.
});

// we should define handler function which is an argument in the first line
// to specify how events are handled
// handler is similar function as in example01.js -> http.createServer(function(req, res){...
function handler(req, res) {
    fs.readFile(__dirname + "/assignment01.html",
    function (err, data) {
        if (err) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            return res.end("Error loading html page.");
        }
    res.writeHead(200);
    res.end(data);
    })
}

var timer1;
var timer2;

http.listen(8080); // server will listen on port 8080

io.sockets.on("connection", function(socket) {
    socket.on("commandToArduino", function(commandNo){
        if (commandNo == "1") {
            board.digitalWrite(13, board.HIGH); // write high on pin 13
        }
        if (commandNo == "0") {
            board.digitalWrite(13, board.LOW); // write low on pin 13
        }
    });
    socket.on("blinkOn", function(){
    timer1 = setInterval(function () {board.digitalWrite(13, board.HIGH);}, 500);
    timer2 = setInterval(function () {board.digitalWrite(13, board.LOW);}, 750);
    });
    socket.on("blinkOff", function(){
        clearInterval(timer1);
        clearInterval(timer2);
    board.digitalWrite(13, board.LOW);
    });


});