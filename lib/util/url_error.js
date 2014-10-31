define(function() {
  "use strict";

  /**
   * Throw an error when a URL is needed, and none is supplied.
   */
  function urlError() {
    throw new Error("A \"url\" property or function must be specified");
  }

  module.exports = urlError;
});
