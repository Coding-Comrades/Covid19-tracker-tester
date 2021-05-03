require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const { static } = require('express');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));


app.get("/", function(req, res){
    res.sendFile(__dirname+"/index.html");
})








app.listen(3000, function() {
    console.log("Server is running on port 3000.");
})