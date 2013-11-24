import Class from "../class";

import _extend from "lodash/objects/assign";

var Transport = Class.extend({
  constructor: function(properties) {
    // Merge in the additional properties.
    _extend(this, properties);

    // If a channel is set, bind to it.
    // Set up custom Model handler logic for the channel.
    if (this.channel) {
      // Whenever this internal data changes, update.
      this.on("change", function() {
        this.channel.publish(this.changed);
      }, this);
    }
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
