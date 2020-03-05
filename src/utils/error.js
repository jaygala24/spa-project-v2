/**
 * Extends Error class
 * @param {number} statusCode - Status code for error
 * @param {String} message - Message for error
 */
class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default ErrorHandler;
