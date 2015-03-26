/**
 * @module sync/transports/xhr
 * @requires module:util/errors
 * @requires module:lodash
 * @requires module:jquery
 */
define(function(require, exports, module) {
  "use strict";

  var Errors = require("../../util/errors");
  var Transport = require("../transport");

  var _ = require("lodash");
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
      options = _.defaults({}, options, this.options);

      options.model = this.model;
      options.method = this.method;

      // Pass the options along to the adapter constructor.
      options.currentAdapter = options.adapter.create(options);

      var type = options.type;

      // Default JSON-request options.
      var params = {type: type, dataType: 'json', url: options.url};

      // If no URL is present, throw a URL error.
      if (!params.url) {
        params.url = _.result(this.model, 'url');

        if (!params.url) {
          throw new Errors.Url();
        }
      }

      // For older servers, emulate JSON by encoding the request into an HTML-form.
      if (options.emulateJSON) {
        params.contentType = 'application/x-www-form-urlencoded';
        params.data = options.data ? {model: options.data} : {};
      }

      // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
      // And an `X-HTTP-Method-Override` header.
      if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
        params.type = 'POST';
        if (options.emulateJSON) params.data._method = type;
        var beforeSend = options.beforeSend;
        options.beforeSend = function(xhr) {
          xhr.setRequestHeader('X-HTTP-Method-Override', type);
          if (beforeSend) return beforeSend.apply(this, arguments);
        };
      }

      // Don't process data on a non-GET request.
      if (params.type !== 'GET' && !options.emulateJSON) {
        params.processData = false;
      }

      // A reference to the `request` function, used for comparison.
      var request = Xhr.prototype.request;

      // Save a reference to the jQuery ajax method.
      var ajax = $.ajax;

      // Maintain compatibility with Backbone's ability to override `ajax`.
      if (typeof Backbone !== "undefined" && Backbone.ajax !== request) {
        ajax = Backbone.ajax;
      }

      // Create a new connection, overriding any additional options.
      var jqXHR = ajax(_.extend({}, options, params));

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
