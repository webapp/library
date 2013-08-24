define(function(require) {
  "use strict";

  // Libraries.
  var _ = require("lodash");

  // Modules.
  var Class = require("./class");

  var Transport = Class.extend({
    constructor: function(properties) {
      // Merge in the additional properties.
      _.extend(this, properties);

      // Call the initialize method if it exists.
      _.result(this, "initialize");
    },

    isAvailable: function() {
      throw "Method not implemented.";
    },

    connect: function() {
      throw "Method not implemented.";
    },

    disconnect: function() {
      throw "Method not implemented.";
    },

    request: function() {
      throw "Method not implemented.";
    },

    requestIfModified: function() {
      throw "Method not implemented.";
    }
  });

  return Transport;
});
