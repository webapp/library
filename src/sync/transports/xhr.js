import Transport from "sync/transport";

module _ from "lodash";
module $ from "jquery";

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
    _.defaults(options, this);

    // Create a new connection.
    var jqXHR = $.ajax(options);

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

export default Xhr;
