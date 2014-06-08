define(function(require, exports, module) {
  "use strict";

  var Class = require("../class");
  var _ = require("lodash");

  var Adapter = Class.extend({
    constructor: function(properties) {
      // Merge in the additional properties.
      _.extend(this, properties);
    },

    isAvailable: function() {
      throw "Method not implemented.";
    },

    get: function() {
      throw "Method not implemented.";
    },

    set: function() {
      throw "Method not implemented.";
    }
  });

  module.exports = Adapter;
});
