/**
 * @module component/view
 * @requires module:component
 */
define(function(require, exports, module) {
  "use strict";

  // WebApp internals.
  var Component = require("../component");

  /**
   * A default view that can be used in markup.
   *
   * @public
   * @memberOf module:component/view
   */
  var ViewComponent = Component.extend({
    selector: "webapp-view"
  });

  module.exports = ViewComponent;
});
