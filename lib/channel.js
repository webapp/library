/**
 * @module channel
 * @requires module:events
 * @requires module:class
 * @requires module:util/errors
 * @requires module:lodash
 */
define(function(require, exports, module) {
  "use strict";

  // WebApp internals.
  var Events = require("./events");
  var Class = require("./class");
  var Errors = require("./util/errors");

  // Third-party dependencies.
  var _ = require("lodash");

  // Global event bus.
  var Bus = _.extend({}, Events);

  // Global channel cache.
  var Cache = {};

  /**
   * A channel is subscribed to and managed from this formal construct.
   *
   * @memberOf module:channel
   */
  var Channel = Class.extend({
    /**
     * Formats a UUID suitable
     * Source: https://gist.github.com/jed/982883
     *
     * @return
     */
    uuid: function() {
      return "0000-0000-0000-0000-0000".replace(/0/g, function() {
        return Math.floor(Math.random() * 16).toString(16);
      });
    },

    normalize: function(callback) {
      if (typeof callback !== "function") {
        throw new Errors.InvalidCallback();
      }

      return function(/*resp*/) {
        // TODO
        /* var retVal = callback(resp); */
      };
    },

    /**
     * Creates or returns an existing Channel.
     *
     * @param {string} name - to identify the channel.
     */
    constructor: function(name) {
      // Name must be a string that does not contain spaces.
      if (typeof name !== "string" || name.indexOf(" ") > -1) {
        name = this.uuid();
      }

      this.name(name);
    },

    name: function(name) {
      // Cache the first instance created.
      if (!Cache[name]) {
        Cache[name] = this;
      }
      // Re-use the existing instance.
      else {
        this.__proto__ = Cache[name].instance;
      }

      this.__name__ = name;
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
      this.listenTo(Bus, this.__name__, function(key, value) {
        value = value || key;

        // If a path was provided, match it to the emitted key.  If no path was
        // provided, simply funnel all key/val to the callback.
        if ((path && path === key) || (!path && typeof key !== "string")) {
          callback.call(context, value, key);
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
        _.each(key, function(val, key) {
          Bus.trigger(this.__name__, key, val);
        }, this);
      }
      else {
        Bus.trigger(this.__name__, key, val);
      }
    }
  });

  module.exports = Channel;
});
