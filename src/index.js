// Libraries.
import $ from "jquery";
import _ from "lodash";

// Modules.
import Class from "class";
import Collection from "collection";
import Component from "component";
import Events from "events";
import History from "history";
import Inheritance from "inheritance";
import Model from "model";
import Router from "router";
import View from "view";
import ViewComponent from "component/view";

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

WebApp.mixin({
  // Expose libraries.
  $: $,
  _: _,

  // Expose modules.
  Class: Class,
  Collection: Collection,
  Component: Component,
  Events: Events,
  History: History,
  Inheritance: Inheritance,
  Model: Model,
  Router: Router,
  //Sync: require("./sync"),
  View: View
});

// Create the default history.
WebApp.history = new History();

// Expose a version.
WebApp.VERSION = "0.1.0-wip";

// Export.
export default WebApp;
