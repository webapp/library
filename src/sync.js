define(function(require, exports, module) {
  "use strict";

  var RestAdapter = require("./sync/adapters/rest");
  var XhrTransport = require("./sync/transports/xhr");

  var _ = require("lodash");

  var noXhrPatch = typeof window !== "undefined" && !!window.ActiveXObject &&
    !(window.XMLHttpRequest && (new XMLHttpRequest).dispatchEvent);

  var Sync = function(method, model, options) {
    var args = ;

    // Set the default options.
    options = _.defaults(options || {}, {
      // Overridable transport and adapter defaults.
      transport: XhrTransport,
      adapter: RestAdapter,

      // Backbone support for older browsers.
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON,

      // Default to the Model/Collection's URL.
      url: _.result(model, "url"),

      // Ensure that we have the appropriate request data.
      data: 
    });

    // If no transport was set, default to Xhr.
    options.transport.create({
      method: method,
      model: model,
      options: options
    });

    if (options.data == null && model && (method === "create" || method === "update" || method === "patch")) {
    }


    // Make the request, allowing the user to override any Ajax options.
    var xhr = xhrTransport.request();
    model.trigger("request", model, xhr, options);
    return xhr;
  };

  module.exports = Sync;
});
