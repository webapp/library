define(function(require, exports, module) {
  "use strict";

  // WebApp internals.
  var Events = require("./events");
  var Inheritance = require("./inheritance");

  // Third-party dependencies.
  var extend = require("lodash/objects/assign");

  /**
   * Base Class constructor.
   */
  function Class() {}

  // Classes provide events.
  extend(Class.prototype, Events, {
    // Set the default constructor.
    constructor: Class
  });

  // Classes provide inheritance.
  extend(Class, Inheritance);

  module.exports = Class;
});
