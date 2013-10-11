import Class from "../class";

import extend from "lodash/objects/assign";

var Transport = Class.extend({
  constructor: function(properties) {
    // Merge in the additional properties.
    extend(this, properties);
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

export default Transport;
