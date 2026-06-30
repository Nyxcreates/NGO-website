// middlewares/validate.js
const { validationResult } = require('express-validator');

// Runs after express-validator chains; bundles all errors into one clean response.
module.exports = function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};
