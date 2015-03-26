define(function(require, exports, module) {
  "use strict";

  var _ = require("lodash");

  /**
   * Url
   *
   * @param message
   */
  exports.Url = function(message) {
    message = message || "A `url` property or function must be specified.";

    this.name = "UrlError";
    this.message = message;
  };

  /**
   * MissingAdapter
   *
   * @param message
   */
  exports.MissingAdapter = function(message) {
    message = message || "An `adapter` property must be specified.";

    this.name = "MissingAdapter";
    this.message = message;
  };

  /**
   * InvalidName
   *
   * @param message
   */
  exports.InvalidName = function(message) {
    message = message || "A valid name must be specified.";

    this.name = "InvalidName";
    this.message = message;
  };

  /**
   * InvalidCallback
   *
   * @param message
   */
  exports.InvalidCallback = function(message) {
    message = message || "A valid callback must be specified.";

    this.name = "InvalidCallback";
    this.message = message;
  };

  // Automatically wire up the prototype, instead of manual assignment.
  _.each(exports, function(Ctor) {
    Ctor.prototype = Error.prototype;
  });
});
