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

    constructor: function(args) {
      Xhr.super("constructor", this, arguments);

      // Ensure we have an adapter to initialize.
      if (!this.options.adapter) {
        throw new Errors.MissingAdapter();
      }

      // Initialize the adapter, passing along arguments.
      this.adapter = this.options.adapter.create.apply(this.options.adapter, arguments);
    },

    request: function(options) {
      options = _.defaults({}, options, this.options);
      var params = _.extend({}, options);

      // If no URL is present, throw a URL error.
      if (!params.url || !options.url) {
        throw new Errors.Url();
      }

      // For older servers, emulate JSON by encoding the request into an
      // HTML-form.
      if (options.emulateJSON) {
        options.contentType = "application/x-www-form-urlencoded";
        options.data = options.data ? { model: options.data } : {};
      }

      // For older servers, emulate HTTP by mimicking the HTTP method with
      // `_method` And an `X-HTTP-Method-Override` header.
      if (options.emulateHTTP && type !== "GET") {
        options.type = "POST";
        if (options.emulateJSON) params.data._method = type;
        var beforeSend = options.beforeSend;
        options.beforeSend = function(xhr) {
          xhr.setRequestHeader("X-HTTP-Method-Override", type);
          if (beforeSend) return beforeSend.apply(this, arguments);
        };
      }

    // Don"t process data on a non-GET request.
    if (params.type !== "GET" && !options.emulateJSON) {
      params.processData = false;
    }

    // If we"re sending a `PATCH` request, and we"re in an old Internet Explorer
    // that still has ActiveX enabled by default, override jQuery to use that
    // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.
    if (params.type === "PATCH" && noXhrPatch) {
      params.xhr = function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
      };
    }

      // Create a new connection, overriding any additional options.
      var jqXHR = $.ajax(_.extend(params, options));

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
