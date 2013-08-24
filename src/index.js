  // Libraries.
  import $ from "jquery";

  // Modules.
  import Class from "./class";
  import Component from "./component";
  import ViewComponent from "./component/view";

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
    $: require("jquery"),
    _: require("lodash"),

    // Expose modules.
    Class: require("./class"),
    Collection: require("./collection"),
    Component: require("./component"),
    Events: require("./events"),
    History: require("./history"),
    Inheritance: require("./inheritance"),
    Model: require("./model"),
    Router: require("./router"),
    //Sync: require("./sync"),
    View: require("./view")
  });

  // Create the default history.
  WebApp.history = new WebApp.History();

  // Expose a version.
  WebApp.VERSION = "0.1.0-wip";

  // Export.
  export default WebApp;
