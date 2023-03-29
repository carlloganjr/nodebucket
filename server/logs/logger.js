/*
================================================================
    Title: logger.js
    Author: Carl Logan
    Date: 03/28/2023
    Description: WEB 450 - nodebucket.
================================================================
*/

// required libraries
const { appendFileSync } = require('fs');
const { join } = require('path');

// file paths
const debugLog = join(__dirname, 'debug.log');
const errorLog = join(__dirname, 'error.log');

// local date and time
const getDateTime = () => {
  const now = new Date();
  return now.toLocaleString('en-US');
}

// messages to insert into the debug log
module.exports.debugLogger = (data) => {
  const logString = `[${getDateTime()}] server\t ${data.filename} - ${data.message}\n`
  appendFileSync(debugLog, logString);
}

// messages to insert into the error log
module.exports.errorLogger = (data) => {
  const logString = `[${getDateTime()}] server\t ${data.filename} - ${data.message}\n`
  appendFileSync(errorLog, logString);
}
