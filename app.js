require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const axios = require('axios');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));




app.get("/", function(req,res){

  axios.get('https://api.covid19india.org/data.json')
    .then(response => {
      // console.log(result.data);
      const data = response.data;
      const statewiseDatas = data.statewise;
      const cases = data.cases_time_series;
      const testedDatas = data.tested;
      // console.log(statewiseData);
      // console.log(cases[cases.length - 1]);
      // console.log(testedDatas[testedData.length - 1]);
      console.log("api called");
      res.render("home", {
        currentCase : cases[cases.length - 1],
        statewiseData : statewiseDatas,
        testData : testedDatas[testedDatas.length - 1]
      });
    })
    .catch(error => {
      console.log(error);
    });

  
    
    
});


app.get("/about", function(req,res){
  res.render("about");
  
});

app.get("/vaccination", function(req,res){
  res.render("vaccination");
  
});






app.listen(3000, function() {
    console.log("Server is running on port 3000.");
})