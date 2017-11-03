var http = require("http").createServer(handler);
var io = require("socket.io").listen(http); // socket library
var fs = require("fs"); // variable for file system
var firmata = require("firmata");

var board = new firmata.Board("/dev/ttyACM0", function(){ // ACM Abstract Control Model for serial communication with Arduino (could be USB)
    console.log("Connecting to Arduino");
    console.log("Activation of Pin 8");
    board.pinMode(8, board.MODES.OUTPUT); // Configures the specified pin to behave either as an input or an output.
    console.log("Activation of Pin 13");
    board.pinMode(13, board.MODES.OUTPUT); // Configures the specified pin to behave either as an input or an output.
    console.log("Activation of Pin 10");
    board.pinMode(10, board.MODES.OUTPUT); // Configures the specified pin to behave either as an input or an output.
    console.log("Activation of Pin 11");
    board.pinMode(11, board.MODES.OUTPUT); // Configures the specified pin to behave either as an input or an output.
});

function handler(req, res) {
    fs.readFile(__dirname + "/assignment04.html", 
    function (err, data) {
        if (err) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            return res.end("Error loading HTML page.");
        }
        res.writeHead(200);
        res.end(data);
    })
}

http.listen(8080);

io.sockets.on("connection", function(socket){
    socket.on("commandToArduino", function(commandNo){
        if (commandNo == "1") {
            board.digitalWrite(13, board.HIGH);
        }
        if (commandNo == "0") {
            board.digitalWrite(13, board.LOW);
        }
        if (commandNo == "2") {
            board.digitalWrite(8, board.LOW); // write LOW on pin 8
        }
        if (commandNo == "3") {
            board.digitalWrite(8, board.HIGH); // write HIGH on pin 8
        } 
        if (commandNo == "5") {
            board.digitalWrite(10, board.HIGH);
        }
        if (commandNo == "4") {
            board.digitalWrite(10, board.LOW);
        }
        if (commandNo == "7") {
            board.digitalWrite(11, board.HIGH);
        }
        if (commandNo == "6") {
            board.digitalWrite(11, board.LOW);
        } 
    });
});