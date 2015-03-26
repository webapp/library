/**
 * @module webapp
 * @requires module:channel
 * @requires module:class
 * @requires module:collection
 * @requires module:component
 * @requires module:events
 * @requires module:history
 * @requires module:inheritance
 * @requires module:model
 * @requires module:router
 * @requires module:view
 * @requires module:component/view
 * @requires module:sync
 * @requires module:sync/transports/xhr
 * @requires module:scopedcss
 * @requires module:jquery
 */
define(function(require, exports, module) {
  "use strict";

  // WebApp internals.
  var Channel = require("./channel");
  var Class = require("./class");
  var Collection = require("./collection");
  var Component = require("./component");
  var Events = require("./events");
  var History = require("./history");
  var Inheritance = require("./inheritance");
  var Model = require("./model");
  var Router = require("./router");
  var View = require("./view");
  var ViewComponent = require("./component/view");
  var Sync = require("./sync");
  var SyncResource = require('./sync/resource');
  var XhrTransport = require("./sync/transports/xhr");

  // Third-party dependencies.
  var ScopedCss = require("scopedcss");
  var $ = require("jquery");
  var _ = require("underscore");

  // Automatically register the default View component.
  Component.register(ViewComponent);

  var WebApp = View.extend({
    el: 'main',

    start: function() {
      this.render();
      Router.history.start();
      return this;
    },

    stop: function() {
      this.$el.remove();
      return this;
    },

    afterRender: function() {
      Component.prototype.afterRender.call(this);
    }
  });

  WebApp.mixin({
    // Expose a version.
    VERSION: "0.1.0-wip",

    // Expose jQuery if it's included, also helps remain compatible with
    // Backbone.
    $: $,

    // Expose other libraries (if they are included).
    _: _,
    ScopedCss: ScopedCss,

    // Expose modules.
    Channel: Channel,
    Class: Class,
    Collection: Collection,
    Component: Component,
    Events: Events,
    History: History,
    Inheritance: Inheritance,
    Model: Model,
    Router: Router,
    View: View,

    // Testing.
    Resource: SyncResource,

    // Expose default transport.
    Transports: {
      Xhr: XhrTransport
    },

    // Backbone compatibility helper.
    noConflict: function() {
      window.Backbone = WebApp.Backbone;
      return WebApp;
    },

    // Expose the sync functionality.
    sync: Sync,

    // Mirror Backbone API by exposing an `ajax` method.
    ajax: function() {
      return WebApp.$.ajax.apply(WebApp.$, arguments);
    },

    // Create new history.
    history: new History()
  });

  // Share the history instance with the Router.
  Router.history = WebApp.history;

  module.exports = WebApp;
});
