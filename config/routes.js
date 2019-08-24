var express = require('express');
var app = express.Router();

const indexRouter = require('../routes/index');
const employeeRouter = require('../routes/employee');

app.use('/', indexRouter);
app.use('/employees', employeeRouter);

module.exports = app;