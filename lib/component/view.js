define(function(require, exports, module) {
  "use strict";

  // WebApp internals.
  var Component = require("../component");

  /**
   *
   */
  var ViewComponent = Component.extend({
    selector: "webapp-view"
  });

  module.exports = ViewComponent;
});
