/**
 * @module sync/transports/xhr
 * @requires module:util/errors
 */
define(function(require, exports, module) {
  "use strict";

  var Errors = require("../../util/errors");
  var Transport = require("../transport");

  var _defaults = require("lodash/objects/defaults");
  var _extend = require("lodash/objects/assign");
  var $ = require("jquery");

  var Xhr = Transport.extend({
    isAvailable: function() {
      return navigator.onLine;
    },

    constructor: function(options) {
      Xhr.super("constructor", this, arguments);

      // Ensure we have an adapter to initialize.
      if (!this.options.adapter) {
        throw new Errors.MissingAdapter();
      }
    },

    request: function(options) {
      options = _defaults({}, options, this.options);

      // Pass the options along to the adapter constructor.
      this.options.adapter.create(this.options);

      var params = _extend({}, options);

      // If no URL is present, throw a URL error.
      if (!params.url || !options.url) {
        throw new Errors.Url();
      }

      // For older servers, emulate JSON by encoding the request into an HTML-form.
      if (options.emulateJSON) {
        params.contentType = 'application/x-www-form-urlencoded';
        params.data = params.data ? {model: params.data} : {};
      }

      // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
      // And an `X-HTTP-Method-Override` header.
      if (options.emulateHTTP && (options.type === 'PUT' || options.type === 'DELETE' || options.type === 'PATCH')) {
        params.type = 'POST';
        if (options.emulateJSON) params.data._method = options.type;
        var beforeSend = options.beforeSend;
        options.beforeSend = function(xhr) {
          xhr.setRequestHeader('X-HTTP-Method-Override', options.type);
          if (beforeSend) return beforeSend.apply(this, arguments);
        };
      }

      // Don"t process data on a non-GET request.
      if (params.type !== "GET" && !options.emulateJSON) {
        params.processData = false;
      }

      // A reference to the `request` function, used for comparison.
      var request = Xhr.prototype.request;

      // Maintain compatibility with Backbone's ability to override `ajax`.
      if (typeof Backbone !== "undefined" && Backbone.ajax !== request) {
        return Backbone.ajax.call(this, _extend(params, options));
      }

      // Create a new connection, overriding any additional options.
      var jqXHR = $.ajax(_extend(params, options));

      // Publish fetched and parsed data to a passed channel.
      if (this.channel) {
        jqXHR.done(function(data) {
          this.channel.publish({ data: data });
        }.bind(this));
      }

      // Return the connection.
      return jqXHR;
    }
  });

  module.exports = Xhr;
});
