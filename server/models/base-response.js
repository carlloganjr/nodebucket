/*
================================================================
    Title: base-response.js
    Author: Carl Logan
    Date: 03/29/2023
    Description: WEB 450 - nodebucket.
================================================================
*/

// this class constructs a typical object for use in responses
class BaseResponse {
  constructor(httpCode, message, data) {
    this.httpCode = httpCode;
    this.message = message;
    this.data = data;
  }

  // create a javascript object
  toObject() {
    return {
      httpCode: this.httpCode,
      message: this.message,
      data: this.data,
      timestamp: new Date().toLocaleDateString('en-US')
    }
  }
}

module.exports = BaseResponse;
