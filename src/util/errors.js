define(function(require, exports, module) {
  "use strict";

  exports.Url = function(message) {
    message = message || "A `url` property or function must be specified.";

    this.name = "UrlError",
    this.message = message;
  };

  exports.MissingAdapter = function(message) {
    message = message || "An `adapter` property must be specified.";

    this.name = "MissingAdapter",
    this.message = message;
  };

  // Automatically wire up the prototype, instead of manual assignment.
  _.each(exports, function(ErrorCtor) {
    ErrorCtor.prototype = Error.prototype;
  });
});
