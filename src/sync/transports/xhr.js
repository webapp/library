import $ from "jquery";
import Transport from "./sync/transport";

import defaults from "lodash/objects/defaults";

var Xhr = Transport.extend({
  isAvailable: function() {
    return navigator.onLine;
  },

  connect: function() {
    // Nothing needed here.
  },

  disconnect: function() {
    // Nothing needed here.
  },

  url: "Property not implemented.",

  request: function(options) {
    // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
    var methodMap = {
      "create": "POST",
      "update": "PUT",
      "patch": "PATCH",
      "delete": "DELETE",
      "read": "GET"
    };

    // Remap.
    options.method = methodMap[options.method];

    // Merge in the instance to the options object.
    defaults(options, this);

    // Return the connection.
    return $.ajax(options);
  }
});

export default Xhr;
