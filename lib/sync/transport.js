define(function(require, exports, module) {
  "use strict";

  var Class = require("../class");

  var _ = require("lodash");

  var Transport = Class.extend({
    constructor: function(properties) {
      // Merge in the additional properties.
      this.options = _.extend({}, this.options, properties.options);

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

  module.exports = Transport;
});
