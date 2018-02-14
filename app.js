require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const authRouter = require('./routes/auth');
const apiRouter = require('./routes/api');

require('./config/passport-setup');

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.session]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth',authRouter);
app.use('/api',apiRouter);
mongoose.connect(process.env.DB_URI).then(
  () => { console.log('Database Connected')},
  err => { console.log("Database Error: " + err)})
app.listen(process.env.PORT,()=>{
  console.log('App runing on port '+ process.env.PORT);
})
