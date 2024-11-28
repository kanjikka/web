var express = require("express");
var app = express();
var path = require("path");

app.use("/japanese-writing-practice", express.static("out"));

console.log("serving port 8080");

app.listen(8080);
