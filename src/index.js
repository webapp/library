import Q from "q";
import Ractive from "ractive";
import ScopedCss from "scopedcss";
import Channel from "./channel";
import Class from "./class";
import Collection from "./collection";
import Component from "./component";
import Events from "./events";
import History from "./history";
import Inheritance from "./inheritance";
import Model from "./model";
import Router from "./router";
import View from "./view";
import ViewComponent from "./component/view";
import { sync } from "./sync";

import $ from "jquery/core";

var WebApp = Class.extend({
  start: function() {
    // The application element.
    this.$el = $(this.mainElement || "body");

    // If the main element entry point is not found.
    if (!this.$el.length) {
      this.$el = $("<div>");
    }

    // Register the ViewComponent and activate on the initial element.
    Component.register(ViewComponent).activateAll(this.$el);
  }
});

WebApp.mixin(Events);

WebApp.mixin({
  // Expose a version.
  VERSION: "0.1.0-wip",

  // Expose libraries.
  $: $,
  Q: Q,
  Ractive: Ractive,
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

  // Expose compatibility helper.
  noConflict: function() {
    window.Backbone = WebApp.Backbone;
    return WebApp;
  },

  // Expose the sync functionality.
  sync: sync,

  // No idea...
  ajax: function() {
    return WebApp.$.ajax.apply(WebApp.$, arguments);
  },

  // Create new history.
  history: new History()
});

export default WebApp;
