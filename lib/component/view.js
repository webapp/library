/**
 * @module component/view
 * @requires module:component
 */
define(function(require, exports, module) {
  "use strict";

  // WebApp internals.
  var Component = require("../component");

  /**
   * A default view, `<webapp-view>`, that can be used in markup.
   *
   * @public
   * @memberOf module:component/view
   */
  var ViewComponent = Component.extend({
    selector: "webapp-view",

    constructor: function() {
      ViewComponent.super("constructor", this, arguments);
      this.channel.subscribe(this.render, this);
    }
  });

  module.exports = ViewComponent;
});
