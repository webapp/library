// Libraries.
import _ from "lodash";

// Modules.
import Class from "./class";

var Adapter = Class.extend({
  constructor: function(properties) {
    // Merge in the additional properties.
    _.extend(this, properties);

    // Call the initialize method if it exists.
    _.result(this, "initialize");
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
