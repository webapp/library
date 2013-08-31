import _ from "lodash";
import Class from "./class";

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

export default Transport;
