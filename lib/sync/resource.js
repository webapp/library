define(function(require, exports, module) {
  "use strict";

  var Model = require("../model");
  var RestAdapter = require("./adapters/rest");
  var XhrTransport = require("./transports/xhr");

  var _ = require("lodash");
  var $ = require("jquery");

  var Resource = Model.extend({
    filter: function() {
      throw "Method not implemented.";
    },

    search: function() {
      throw "Method not implemented.";
    },

    sortBy: function() {
      throw "Method not implemented.";
    },

    update: function(objects) {
      // Save the full representation from the server.
      this.raw = objects;

      // A Lo-Dash wrapped version of the data.
      this.dataset = _.chain(objects);
    },

    syncUpdate: function(options) {
      options = _.extend({}, this.options, options);

      // Attach the resource reference.
      options.model = this;

      var transport = options.transport || this.transport;

      // The following method will choke if we have not previously fetched and
      // set a `last_modified` value.
      if (this.get("last_modified")) {
        transport.requestIfModified(options);
      }
    },

    // Only publically expose the promise.
    promise: function() {
      return this._def.promise();
    },

    url: "Property not implemented.",

    syncAll: function(options) {
      options = _.extend({}, this.options, options);

      // Attach the resource reference.
      options.model = this;
      this.unset("last_modified");

      // Pipe through the identical sync method.
      return this.sync("GET", this, options);
    },

    updateNotify: function(newObjects) {
      var currentObjects = this.adapter.get();
      var currentLength = currentObjects.length;

      _.each(newObjects, function(object) {
        var found = _.findWhere(currentObjects, { id: object.id });

        if (found) {
          _.extend(found, object);
        } else {
          currentObjects.push(object);
        }
      });

      var isAdded = (currentLength !== currentObjects.length);

      this.adapter.set(currentObjects);

      if (isAdded) {
        // This is only an add event
        this.trigger("updateCalculations");
      } else {
        // Add & modify -- everything must be refreshed
        this.update(currentObjects);
      }
    },

    // The transport handler for a Resource is transport agnostic, so long as
    // the transport follows the same conventions as the default attached
    // class.
    sync: function(method, model, options) {
      var req = Resource.super('sync', this, arguments);
      var resource = this;
      var def = this._def;

      req.then(function(resp) {
        if (resource.channel) {
          resource.channel.publish('classes', resp);
        }
      });

      // Once the request has completed, set the cache.
      //req.then(function(resp) {
      //  adapter.set(resp);

      //  // Store in the state object.
      //  resource.update(resp);
      //});

      // No matter what, always resolve, even if failure occurs.
      //req.always(function() {
      //  // Resolve the internal deferred.
      //  def.resolveWith(this, [adapter.get()]);
      //});

      // Pipe the progress to the notify.
      req.progress(def.notify.bind(this));

      // Return an immutable promise.
      return req;
    },

    initialize: function(options, attributes) {
      // This is used internally to track the state of this resource.
      this._def = $.Deferred();

      // Save this for later mixin.
      this.options = options;

      // Set the name for `where` lookups.
      this.set("name", options.name, { silent: true });

      // By default use RESTful requests.
      this.adapter = RestAdapter;

      // By default use XHR.
      this.transport = XhrTransport;

      this.on("update", this.updateNotify);

      // Defaults.
      this.raw = [];
      this.dataset = _.chain(this.raw);

      // Merge in the additional properties.
      _.extend(this, options);
    }
  });

  module.exports = Resource;
});
