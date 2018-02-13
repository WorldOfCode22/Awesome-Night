require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URI).then(
  () => { console.log('Database Connected')},
  err => { console.log("Database Error: " + err)})
app.listen(process.env.PORT,()=>{
  console.log('App runing on port '+ process.env.PORT);
})
