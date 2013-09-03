import Events from "./events";
import Class from "./class";

import _extend from "lodash/objects/assign";
import _each from "lodash/collections/forEach";

// Global event bus that handles message passing.
var Bus = _extend({}, Events);

// A channel is subscribed to and managed from this formal construct.
var Channel = Class.extend({
  constructor: function(name) {
    this.name = name;
  },

  subscribe: function(path, callback, context) {
    // Argument shifting.
    if (typeof path !== "string") {
      context = callback;
      callback = path;
      path = undefined;
    }

    // Monitor the bus and trigger based on what is being monitored.
    this.listenTo(Bus, this.name, function(key, value) {
      // If a path was provided, match it to the emitted key.
      if (path && path === key) {
        callback.call(context, value, key);
      // If no path was provided, simply funnel all key/val to the callback.
      } else if (!path) {
        callback.call(context, value, key);
      }
    });
  },

  unsubscribe: function(name) {
    this.stopListening(Bus, name);
  },

  publish: function(key, val) {
    if (typeof key !== "string") {
      _each(key, function(val, key) {
        Bus.trigger(this.name, key, val);
      }, this);
    } else {
      Bus.trigger(this.name, key, val);
    }
  }
});

export default Channel;
