define(function(require, exports, module) {
  "use strict";

  var each = require("lodash/collections/forEach");

  exports.Url = function(message) {
    message = message || "A `url` property or function must be specified.";

    this.name = "UrlError";
    this.message = message;
  };

  exports.MissingAdapter = function(message) {
    message = message || "An `adapter` property must be specified.";

    this.name = "MissingAdapter";
    this.message = message;
  };

  exports.InvalidName = function(message) {
    message = message || "A valid name must be specified.";

    this.name = "InvalidName";
    this.message = message;
  };

  // Automatically wire up the prototype, instead of manual assignment.
  each(exports, function(Ctor) {
    Ctor.prototype = Error.prototype;
  });
});
