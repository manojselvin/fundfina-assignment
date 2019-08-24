const express = require('express');
const bodyParser = require('body-parser');
const { port } = require('./config/config');
const router = require('./config/routes');
const database = require('./config/database/database');
const app = express();
const mysql = require('mysql');
const connection  = require('express-myconnection');
const session = require('express-session');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');

// Templating engine
app.set('views', './views');
app.set('view engine', 'ejs');

// Connecting to DB
app.use(connection(mysql, database, 'pool'));

// Form Validation
// app.use(check);

// Parsing Request and Query Params in JSON
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cookieParser('fundfinamanojselvin'));
app.use(session({ 
    secret: 'fundfinamanojselvin',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

// Flash Messages
app.use(flash())

app.use(router);

app.listen(port,
  function(){
    console.log("Express server listening on port " + port);
});