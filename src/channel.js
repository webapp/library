import Events from "events";
import Class from "class";
import Model from "model";
import Collection from "collection";

import _extend from "lodash/objects/assign";
import _each from "lodash/collections/forEach";
import _map from "lodash/collections/map";

// Global event bus.
var Bus = _extend({}, Events);

// Global channel cache.
var Cache = {};

// A channel is subscribed to and managed from this formal construct.
var Channel = Class.extend({
  constructor: function(name) {
    // Name must be a string that does not contain spaces.
    if (!name || typeof name !== "string" || name.indexOf(" ") > -1) {
      throw new Error("Invalid name property.");
    }

    if (!Cache[name]) {
      // Cache the first instance created.
      Cache[name] = this;
    } else {
      // Use that existing instance that was created.
      this.__proto__ = Cache[name];
    }

    // Channel name.
    this.name = name;

    // Create a new model if one hasn't been created yet.
    this.model = this.model || new Model();
    // Set a reference to the channel in the model.
    this.model.channel = Cache[name];
  },

  // Listen to broadcasted events.
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

  // Unsubscribes an entire channel instance or only specific sub channels
  // within the instance.
  unsubscribe: function(name) {
    this.stopListening(Bus, name);
  },

  // Write changes into the Channel stream.
  publish: function(key, val) {
    this.model.set(key, val);

    if (typeof key !== "string") {
      _each(key, function(val, key) {
        Bus.trigger(this.name, key, val);
      }, this);
    } else {
      Bus.trigger(this.name, key, val);
    }
  }
});

// Handles multiple Channels.
Channel.List = Collection.extend({
  constructor: function(names) {
    // Convert a string of names to an Array of Channel models.
    var models = _map(names.split(" "), function(name) {
      return Channel.create(name).model;
    });

    Channel.List.super("constructor", this, [models]);
  }
});

export default Channel;
