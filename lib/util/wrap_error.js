define(function(require, exports, module) {
  "use strict";

  /**
   * Wrap an optional error callback with a fallback error event.
   *
   * @param {Object} model - The model or collection to wrap.
   * @param {Object} options - An optional object to forward.
   */
  function wrapError(model, options) {
    var error = options.error;

    options.error = function(resp) {
      if (error) {
        error(model, resp, options);
      }

      model.trigger("error", model, resp, options);
    };
  }

  module.exports = wrapError;
});
