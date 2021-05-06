require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const axios = require('axios');
const { inflateRawSync } = require('zlib');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));


mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true});


const storeSchema = {
  name : String,
  address : String,
  contact : Number,
  medicine : String,
  district : String
};

const Store = new mongoose.model("Store",storeSchema);


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
app.get("/medicines",function(req,res){

  Store.find({},function(err,foundItems){
      res.render("medicines",{newListItems: foundItems});
  })

  
});

app.post("/addlead",function(req,res){
  const storeName = req.body.storeName;
  const storeDistrict = req.body.district;
  const storeContact = req.body.contact;
  const storeAddress = req.body.contact;
  const storeMedicine = req.body.medicine;

  console.log(storeName);
  console.log(storeDistrict);
  console.log(storeContact);
  console.log(storeAddress);
  console.log(storeMedicine);

  res.redirect("/medicines");

})

  

app.listen(3000, function() {
    console.log("Server is running on port 3000.");
})