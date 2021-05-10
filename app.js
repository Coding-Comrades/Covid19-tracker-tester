require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const axios = require('axios');
const { inflateRawSync } = require('zlib');
const _ = require("lodash");
const { response } = require('express');
const { error } = require('console');
const selectdata = require('./data.js');



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

var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

// var today=new Date();
// var date=today.getDate();
// var monthnum=today.getMonth();


// var currentdate = date + '-' + monthnum + '-' + year;
// console.log(currentdate);
var today = new Date();
var date = today.toJSON().slice(0, 10);
var nDate = date.slice(8, 10) + '-' + date.slice(5, 7) + '-' + date.slice(0, 4);
var year=today.getFullYear();
var month=monthNames[today.getMonth()];

//console.log(dt);


const Store = mongoose.model("Store",storeSchema);
  var datas;
  var statewiseDatas;
  var cases;
  var testedDatas;

  
  axios.get('https://api.covid19india.org/data.json')
  .then(response => {
    datas = response.data;
    statewiseDatas = datas.statewise;
    cases = datas.cases_time_series;
    testedDatas = datas.tested;
    // console.log(statewiseDatas);
    // console.log(cases[cases.length - 1]);
    // console.log(testedDatas[testedDatas.length - 1]);
    console.log("api called");
    
  })
  .catch(error => {
    console.log(error);
  });
app.get("/", function(req,res){

  

    res.render("home", {
      currentCase : cases[cases.length - 1],
      statewiseData : statewiseDatas,
      testData : testedDatas[testedDatas.length - 1]
    });
    
    
});


app.get("/about", function(req,res){
  res.render("about");
  
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



let pincodeconfig = {
  method: 'get',
  url: 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=841231&date=09-05-2021',
  headers: {
      'accept': 'application/json',
      'Accept-Language': 'hi_IN',
      'User-Agent': 'covid19'
  }
};

  var crdata;

axios(pincodeconfig)
  .then(response => {
    crdata = response.data.centers;
    console.log("Pin Code by 7 days api running");
  
  })
  .catch(error => {
      console.log(error);
  });


var stateselected;


app.post("/pinform", function(req,res){

  console.log(req.body.pininput);
  
});


var distresponse;
app.post("/select1", function(req,res){

  var stateid = req.body.statelists;

  

  // res.render("select2", 
  // {
  //   distlist : distresponse
  // }); 

});


app.post("/select2", function(req,res){

  var distid = req.body.statelists;

  let districtconfig = {
    method: 'get',
    url: 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=' + distid + '&date=' + nDate,
    headers: {
        'accept': 'application/json',
        'Accept-Language': 'hi_IN',
        'User-Agent': 'covid19'
    }
  };

  axios(districtconfig)
  .then(response => {
    console.log("district by 7 days api running");
    distresponse = response.data.centers;
  })
  .catch(error => {
      console.log(error);
  });
});

app.get("/vaccination", function(req,res){


  var dt1=date+" "+month+" "+year;
  var dt2=date+1+" "+month+" "+year;
  var dt3=date+2+" "+month+" "+year;
  var dt4=date+3+" "+month+" "+year;
  var dt5=date+4+" "+month+" "+year;
  var dt6=date+5+" "+month+" "+year;
  var dt7=date+6+" "+month+" "+year;


  res.render("vaccination", 
  {
    todaydate1: dt1,todaydate2: dt2,todaydate3: dt3,todaydate4: dt4,todaydate5: dt5,todaydate6: dt6,todaydate7: dt7, 

    centersData: crdata,

    statelist: selectdata.statelist,
    
    distlist : selectdata.distlist,
  }); 

  
});


app.listen(3000, function() {
    console.log("Server is running on port 3000.");
})