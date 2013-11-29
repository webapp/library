import Class from "../class";

module _ from "lodash";

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

export default Adapter;
