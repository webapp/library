/**
 * @module class
 * @requires module:events
 * @requires module:inheritance
 * @requires module:lodash
 */
define(function(require, exports, module) {
  "use strict";

  // WebApp internals.
  var Events = require("./events");
  var Inheritance = require("./inheritance");

  // Third-party dependencies.
  var _ = require("lodash");

  /**
   * Base Class constructor.
   */
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
