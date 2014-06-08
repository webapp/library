/**
 * @module channel
 * @requires module:events
 * @requires module:class
 * @requires module:util/errors
 * @requires module:lodash/collections/forEach
 * @requires module:lodash/objects/assign
 */
define(function(require, exports, module) {
  "use strict";

  // WebApp internals.
  var Events = require("./events");
  var Class = require("./class");
  var Errors = require("./util/errors");

  // Third-party dependencies.
  var each = require("lodash/collections/forEach");
  var extend = require("lodash/objects/assign");

  // Global event bus.
  var Bus = extend({}, Events);

  // Global channel cache.
  var Cache = {};

  /**
   * A channel is subscribed to and managed from this formal construct.
   *
   * @memberOf module:channel
   */
  var Channel = Class.extend({
    /**
     * Creates or returns an existing Channel.
     *
     * @param {string} name - to identify the channel.
     */
    constructor: function(name) {
      // Name must be a string that does not contain spaces.
      if (typeof name !== "string" || name.indexOf(" ") > -1) {
        throw new Errors.InvalidName();
      }

      // Cache the first instance created.
      if (!Cache[name]) {
        Cache[name] = this;
      }
      // Re-use the existing instance.
      else {
        this.__proto__ = Cache[name].instance;
      }

      this.name = name;
    },

    /**
     * Listen to broadcasted events.
     *
     * @param {string} path
     * @param {function} callback
     * @param {object} context
     *
     */
    subscribe: function(path, callback, context) {
      // Argument shifting.
      if (typeof path !== "string") {
        context = callback || this;
        callback = path;
        path = undefined;
      }

      // Monitor the bus and trigger based on what is being monitored.
      this.listenTo(Bus, this.name, function(key, value) {
        // If a path was provided, match it to the emitted key.  If no path was
        // provided, simply funnel all key/val to the callback.
        if ((path && path === key) || !path) {
          callback.call(context, key, value);
        }
      });
    },

    /**
     * Unsubscribes an entire channel instance or only specific sub channels
     * within the instance.
     *
     * @param {string} name
     */
    unsubscribe: function(name) {
      this.stopListening(Bus, name);
    },

    /**
     * Write changes into the Channel stream.
     *
     * @param key
     * @param val
     */
    publish: function(key, val) {
      if (typeof key === "object" && !Array.isArray(key)) {
        each(key, function(val, key) {
          Bus.trigger(this.name, key, val);
        }, this);
      }
      else {
        Bus.trigger(this.name, key, val);
      }
    }
  });

  module.exports = Channel;
});
