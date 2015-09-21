define(function(require, exports, module) {
  "use strict";

  var View = require("./view");
  var Channel = require("./channel");

  var _ = require("lodash");
  var $ = require("jquery");
  var ScopedCss = require("scopedcss");

  // The View base class for the Component.
  var Component = View.extend({
    constructor: function(options) {
      // Ensure the View is correctly set up.
      Component.super("constructor", this, arguments);

      // Attach the dataset.
      this.dataset = this.$el.data();

      // Always create a channel.
      this.channel = Channel.create(this.channels);

      // Maintain the dataset.
      this.channel.subscribe(function(value, key) {
        this.dataset[key] = value;
      }, this);
    },

    // Default to data found in the DOM.
    serialize: function() {
      return this.dataset;
    },

    afterRender: function() {
      // Seek out nested components and render them.
      Component.activateAll(this);

      // Also activate all scoped stylesheets.
      ScopedCss.applyTo(this.$el[0]);
    }
  });

  Component.mixin({
    components: {},

    register: function(Component, identifier) {
      // Allow a manual override of the selector to use.
      identifier = identifier || Component.prototype.selector;

      // Shim the element for older browsers.
      if (identifier.slice(0, 1).match(/[A-Za-z]/)) {
        document.createElement(identifier);
      }

      // Register a Component constructor, not an instance.
      this.components[identifier] = {
        ctor: Component,
        instances: []
      };

      // Save a pointer for easier lookup.
      Component.__pointer__ = this.components[identifier];

      return Component;
    },

    unregister: function(identifier) {
      delete this.components[identifier];
    },

    augment: function(cb) {
      _.each(this.__pointer__.instances, function(instance) {
        cb.call(instance, instance);
      });
    },

    activate: function($el, instances) {
      var CurrentComponent = this;

      // Convert all attributes on the Element into View properties.
      var attrs = _.reduce($el[0].attributes, function(attrs, attr) {
        var name = attr.name;

        // Optionally consume data attributes.
        if (attr.name.indexOf("data-") === 0) {
          name = attr.name.slice(5);
        }

        attrs[name] = attr.value;

        return attrs;
      }, {});

      // Associate the element as well.
      attrs.el = $el;

      // Create a new Component.
      var component = new CurrentComponent(attrs);

      // Trigger the standard `createdCallback`.
      if (typeof component.createdCallback === "function") {
        component.createdCallback();
      }

      // Add to the internal cache.
      instances.push(component);

      // By default use the template property provided, otherwise pull the
      // template contents from the DOM.
      if (!component.template) {
        component.template = _.template(_.unescape($el.html()));
      }

      // Render and apply to the Document.
      component.render();
    },

    activateAll: function(component) {
      var el = component ? component.el : document.body;

      _.each(this.components, function(Component, selector) {
        $(el).find(selector).each(function() {
          Component.ctor.activate($(this), Component.instances);
        });
      });
    }
  });

  module.exports = Component;
});
