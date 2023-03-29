/*
================================================================
    Title: item.js
    Author: Carl Logan
    Date: 03/27/2023
    Description: WEB 450 - nodebucket.
================================================================
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// set the model for the tasks
let itemSchema = new Schema({
  text: {type: String}
});

module.exports = itemSchema;
