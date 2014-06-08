/**
 * @module sync/adapters/rest
 * @requires module:sync/adapter
 */
define(function(require, exports, module) {
  "use strict";

  var Adapter = require("../adapter");

  var Rest = Adapter.extend({
    /**
     * Map from CRUD to HTTP for our default `Backbone.sync` implementation.
     *
     * @public
     * @memberOf module:sync/adapters/rest
     * @type {Object}
     */
    methodMap: {
      "create": "POST",
      "update": "PUT",
      "patch":  "PATCH",
      "delete": "DELETE",
      "read":   "GET"
    },

    /**
     * constructor
     *
     * @return
     */
    constructor: function() {
      Rest.super("constructor", this, arguments);

      var method = this.method;
      var model = this.model;
      var options = this.options;

      // JSON-request options.
      if (!options.type) {
        options.type = this.methodMap[method];
      }

      // Set appropriate request data.
      if (!options.data) {
        options.contentType = "application/json";
        options.data = JSON.stringify(options.attrs || model.toJSON(options));
      }
    },

    /**
     * get
     *
     * @return
     */
    get: function() {
      return this.cache;
    },

    /**
     * set
     *
     * @param objects
     * @return
     */
    set: function(objects) {
      this.cache = objects;
    }
  });

  module.exports = Rest;
});
