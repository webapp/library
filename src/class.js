define(function(require, exports, module) {
  "use strict";
  
  var _ = require("lodash");

  function Class() {}

  // All Classes should provide events.
  _.extend(Class.prototype, require("./events"), {
    // Set the default constructor to the above named constructor.
    constructor: Class
  });

  // Classes provide inheritance.
  _.extend(Class, require("./inheritance"));

  module.exports = Class;
});
