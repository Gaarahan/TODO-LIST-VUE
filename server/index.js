const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = require('./routes/router.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend:false}));

app.use(router);

app.listen('8848',(err)=>{
  if(err)
    throw err;
  else
    console.log("server start at http://localhost:8848 ...");
});