define(function(require, exports, module) {
  "use strict";

  var Events = require("./events");
  var Inheritance = require("./inheritance");

  var _ = require("lodash");

  function Class() {}

  // Classes provide events.
  _.extend(Class.prototype, Events, {
    // Set the default constructor.
    constructor: Class
  });

  // Classes provide inheritance.
  _.extend(Class, Inheritance);

  module.exports = Class;
});
