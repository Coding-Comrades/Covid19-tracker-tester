require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const axios = require('axios');
const { inflateRawSync } = require('zlib');
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

const dbUrl = 'mongodb+srv://covid19tracker:xd5duo5vZHG9BpnX@cluster0.bt3xj.mongodb.net/covid19trackerdb?retryWrites=true&w=majority';
mongoose.connect(dbUrl,  { useNewUrlParser: true, useUnifiedTopology: true, 'useFindAndModify': false});


const storeSchema = mongoose.Schema({
  name : String,
  address : String,
  contact : Number,
  medicine : String,
  district : String
});

const Store = mongoose.model("Store",storeSchema);


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
  const storeDistrict = _.capitalize(req.body.district);
  const storeContact = _.capitalize(req.body.contact);
  const storeAddress = _.capitalize(req.body.contact);
  const storeMedicine = _.capitalize(req.body.medicine);

  // console.log(storeName);
  // console.log(storeDistrict);
  // console.log(storeContact);
  // console.log(storeAddress);
  // console.log(storeMedicine);

  const store = new Store({
    name : storeName,
    address : storeDistrict,
    contact : storeContact,
    medicine : storeMedicine,
    district : storeAddress
  })
  store.save();
  res.redirect("/medicines");

})

  

app.listen(3000, function() {
    console.log("Server is running on port 3000.");
})