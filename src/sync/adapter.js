import Class from "../class";

import extend from "lodash/objects/assign";

var Adapter = Class.extend({
  constructor: function(properties) {
    // Merge in the additional properties.
    extend(this, properties);
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

export default Adapter;
