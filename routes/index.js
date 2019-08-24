const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.get('/', function(req, res) {

    // render to views/index.ejs template file
    res.render('index', {title: 'Employee - Add/Display Records'})
})

module.exports = app;