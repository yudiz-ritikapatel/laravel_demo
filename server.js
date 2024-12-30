const http = require('http');
const url = require('url');
const fs = require('fs');
const uc = require('upper-case');
var events = require('events');
var mysql = require('mysql');
const env = require('dotenv').config();

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Connect to the MySQL server
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to MySQL!");

    // Create a database
    con.query("CREATE DATABASE IF NOT EXISTS mydb", function (err, result) {
        if (err) throw err;
        console.log("Database created or already exists.");
    });

    // Use the database
    con.query("USE mydb", function (err, result) {
        if (err) throw err;
        console.log("Using mydb database.");
    });

    // Create a table
    const createTableSql = `
        CREATE TABLE IF NOT EXISTS customers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            address VARCHAR(255)
        )
    `;
    con.query(createTableSql, function (err, result) {
        if (err) throw err;
        console.log("Table created or already exists.");
    });

    // Insert a record
    const insertSql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
    con.query(insertSql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted, ID:", result.insertId);
    });

    // Select all records
    con.query("SELECT * FROM customers", function (err, result) {
        if (err) throw err;
        console.log("All records:", result);
    });

    // Select with WHERE clause
    con.query("SELECT * FROM customers WHERE address = 'Highway 37'", function (err, result) {
        if (err) throw err;
        console.log("Filtered records:", result);
    });

    // Select with ORDER BY
    con.query("SELECT * FROM customers ORDER BY name", function (err, result) {
        if (err) throw err;
        console.log("Ordered records:", result);
    });

    // Use parameterized queries
    const adr = 'Highway 37';
    const paramQuery = "SELECT * FROM customers WHERE address = ?";
    con.query(paramQuery, [adr], function (err, result) {
        if (err) throw err;
        console.log("Parameterized query result:", result);
    });

    // Select with LIMIT
    con.query("SELECT * FROM customers LIMIT 5", function (err, result) {
        if (err) throw err;
        console.log("Limited records:", result);
    });

    // Select with LIMIT and OFFSET
    con.query("SELECT * FROM customers LIMIT 5 OFFSET 2", function (err, result) {
        if (err) throw err;
        console.log("Limited with offset records:", result);
    });

    // Delete a record
    const deleteSql = "DELETE FROM customers WHERE address = 'Highway 37'";
    con.query(deleteSql, function (err, result) {
        if (err) throw err;
        console.log("Number of records deleted:", result.affectedRows);
    });

    // Drop the table
    const dropTableSql = "DROP TABLE IF EXISTS customers";
    con.query(dropTableSql, function (err, result) {
        if (err) throw err;
        console.log("Table deleted (if exists).");
    });

    // Close the connection
    con.end(function (err) {
        if (err) throw err;
        console.log("Connection closed.");
    });
});

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
