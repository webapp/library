define(function(require, exports, module) {
  "use strict";

  var $ = require("jquery");
  var _ = require("lodash");
  var Q = require("q");
  var History = require("history");
  var ScopedCss = require("scopedcss");
  var Ractive = require("ractive");

  var Class = require("./class");
  var Component = require("./component");

  // A default component to remotely load template files.
  var ViewComponent = require("./components/view");

  // The `WebApp` object.
  var WebApp = Class.extend({
    constructor: function() {
      this.components = {};
    },

    start: function() {
      // The application element.
      this.$el = $(this.mainElement || "main");

      // If the main element entry point is not found.
      if (!this.$el.length) {
        this.$el = $("<div>");
      }

      // Register the ViewComponent and activate on the initial element.
      Component.register(ViewComponent).activateAll(this.$el);
    }
  });

  // Attach modules directly for access.
  WebApp.mixin({
    Class: require("./class"),
    Collection: require("./collection"),
    Events: require("./events"),
    Inheritance: require("./inheritance"),
    Model: require("./model"),
    Router: require("./router"),
    View: require("./view")
  });

  // Export dependencies.
  WebApp.$ = $;
  WebApp._ = _;
  WebApp.Q = Q;
  WebApp.History = History;
  WebApp.ScopedCss = ScopedCss;
  WebApp.Ractive = Ractive;

  // Expose a version.
  WebApp.VERSION = "0.1.0-wip";

  // Export.
  module.exports = WebApp;
});
