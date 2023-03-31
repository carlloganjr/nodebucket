/*
================================================================
    Title: base-response.js
    Author: Carl Logan
    Date: 03/29/2023
    Description: WEB 450 - nodebucket.
================================================================
*/

class BaseResponse {
  constructor(httpCode, message, data) {
    this.httpCode = httpCode;
    this.message = message;
    this.data = data;
  }

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
