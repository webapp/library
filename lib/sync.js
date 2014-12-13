define(function(require, exports, module) {
  "use strict";

  var RestAdapter = require("./sync/adapters/rest");
  var XhrTransport = require("./sync/transports/xhr");

  var Backbone = require("./index");
  var _ = require("lodash");

  var noXhrPatch = typeof window !== "undefined" && !!window.ActiveXObject &&
    !(window.XMLHttpRequest && (new XMLHttpRequest).dispatchEvent);

  var Sync = function(method, model, options) {
    // Set the default options.
    options = _.defaults(options || {}, {
      // Overridable transport and adapter defaults.
      transport: XhrTransport,
      adapter: RestAdapter,

      // Backbone support for older browsers.
      emulateHTTP: options.emulateHTTP,
      emulateJSON: options.emulateJSON,

      // Default to the Model/Collection's URL.
      url: _.result(model, "url")
    });

    // If no transport was set, default to Xhr.
    var transport = options.transport.create({
      method: method,
      model: model,
      options: options
    });

    // Make the request, allowing the user to override any Ajax options.
    var req = transport.request();
    model.trigger("request", model, req, options);

    // Assign to `xhr` property, for Backbone compatibility.
    options.xhr = req;

    return req;
  };

  module.exports = Sync;
});
