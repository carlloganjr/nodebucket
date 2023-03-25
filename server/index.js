/*
================================================================
    Title: index.js
    Author: Carl Logan
    Date: 03/20/2023
    Description: WEB 450 - nodebucket.
================================================================
*/

/**
 * Require statements
 */
const express = require('express');
const swaggerUI = require('swagger-ui-express');
const swaggerJS = require('swagger-jsdoc');
const path = require('path');
const mongoose = require('mongoose');
const createError = require('http-errors');
const EmployeeRoute = require('./routes/employee-route');


const app = express(); // Express variable.

console.log('directory ==> '+ path.join(__dirname, './routes'))

/**
 * App configurations.
 */
app.use(express.json());
app.use(express.urlencoded({'extended': true}));
app.use(express.static(path.join(__dirname, '../dist/nodebucket')));
app.use('/', express.static(path.join(__dirname, '../dist/nodebucket')));

// default server port value.
const PORT = process.env.PORT || 3000;

// Database connection string (including username/password).
const CONN = 'mongodb+srv://nodebucket_user:s3cret@bellevueuniversity.dbdc0d0.mongodb.net/nodebucket?retryWrites=true&w=majority';

/**
 * Database connection.
 */
mongoose.connect(CONN).then(() => {
  console.log('Connection to the database was successful');
}).catch(err => {
  console.log('MongoDB Error: ' + err.message);
});

// create the API documentation
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'nodebucket API',
      version: '1.0.0',
    },
  },
  // the documentation will be created from these route files
  apis: [path.join(__dirname, './routes/*.js')],
};

// for handling the swagger docs and creating the swagger UI
const openapiSpecification = swaggerJS(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(openapiSpecification));

app.use('/api/employees', EmployeeRoute);

// any route not found
app.use((req, res, next) => {
  next(createError(404))
});

// any unexpected error returned
app.use((req, res, next) => {
  res.status(err.status || 500);

  res.send({
    type: 'error',
    status: err.status,
    message: err.message,
    stack: req.app.get('env') === 'development' ? err.stack : undefined
  })
});


// Wire-up the Express server.
app.listen(PORT, () => {
  console.log('Application started and listening on PORT: ' + PORT);
})
