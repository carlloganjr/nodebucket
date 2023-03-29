/*
================================================================
    Title: employees.js
    Author: Carl Logan
    Date: 03/20/2023
    Description: WEB 450 - nodebucket.
================================================================
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const itemSchema = require('./item')

// set the model for the employee collection in the nodebucket database
let employeeSchema = new Schema({
  empId: {type: Number, unique: true, required: true},
  firstName: {type: String},
  lastName: {type: String},
  // arrays to hold the tasks
  todo: [itemSchema],
  done: [itemSchema]
}, {collection: 'employees'});

module.exports = mongoose.model('Employee', employeeSchema);
