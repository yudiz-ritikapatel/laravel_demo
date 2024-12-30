const http = require('http');
const url = require('url');
const fs = require('fs');
const uc = require('upper-case');
var events = require('events');

http.createServer(function (req, res) {
    const adr = 'http://localhost:8080/default.htm?year=2017&month=february';
    const parsedUrl = url.parse(adr, true);

    // Log parsed URL details
    console.log("q.host", parsedUrl.host);
    console.log("q.pathname", parsedUrl.pathname);
    console.log("q.search", parsedUrl.search);
    console.log("qdata", parsedUrl.query);

    console.log("req", req.url);

    var eventEmitter = new events.EventEmitter();

    //Create an event handler:
    var myEventHandler = function () {
        console.log('I hear a scream!');
    }

    eventEmitter.on('scream', myEventHandler);
    eventEmitter.emit('scream');

    // Parse the incoming request URL
    const q = url.parse(req.url, true);
    const filename = "." + q.pathname;

    // Handle serving files
    fs.readFile(filename, function (err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end("404 Not Found");
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(uc.upperCase("Hello World!"));
            res.end(data);
        }
    });

    // Perform file operations (these will log to the console only)
    fs.appendFile('public/mynewfile1.txt', 'Hello content!', function (err) {
        if (err) throw err;
        console.log('Saved mynewfile1!');
    });

    fs.open('mynewfile2.txt', 'w', function (err, file) {
        if (err) throw err;
        console.log('Saved mynewfile2!');
    });

    fs.writeFile('mynewfile3.txt', 'Hello content!', function (err) {
        if (err) throw err;
        console.log('Saved mynewfile3!');
    });

    fs.appendFile('mynewfile1.txt', ' This is my text.', function (err) {
        if (err) throw err;
        console.log('Updated!');
    });

    fs.writeFile('mynewfile3.txt', 'This is my text', function (err) {
        if (err) throw err;
        console.log('Replaced!');
    });

    fs.unlink('mynewfile2.txt', function (err) {
        if (err) throw err;
        console.log('File deleted!');
    });

    fs.rename('public/mynewfile1.txt', 'public/myrenamedfile.txt', function (err) {
        if (err) throw err;
        console.log('File Renamed!');
    });
}).listen(8080);

console.log('Server running at http://127.0.0.1:8080/');
