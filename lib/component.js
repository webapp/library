define(function(require, exports, module) {
  "use strict";

  // Internal.
  var Events = require("./events");
  var View = require("./view");
  var Channel = require("./channel");

  // Utilities.
  var _template = require("lodash/utilities/template");
  var _extend = require("lodash/objects/assign");
  var _keys = require("lodash/objects/keys");
  var _each = require("lodash/collections/forEach");
  var _reduce = require("lodash/collections/reduce");
  var _unescape = require("lodash/utilities/unescape");

  // DOM Methods.
  var $ = require("jquery/core");
  var $parseHTML = require("jquery/core/parseHTML");
  var $manipulation = require("jquery/manipulation");
  var $traversing = require("jquery/traversing");
  var $attributes = require("jquery/attributes");

  // CSS scoping.
  var ScopedCss = require("scopedcss");

  // The View base class for the Component.
  var Component = View.extend({
    constructor: function() {
      if (typeof this.channel === "string") {
        this.channel = Channel.create(this.channel);
      }

      // Ensure the View is correctly set up.
      Component.super("constructor", this, arguments);
    },

    afterRender: function() {
      // Seek out nested components and render them.
      Component.activateAll(this.$el);

      // Also activate all scoped stylesheets.
      ScopedCss.applyTo(this.$el[0]);
    }
  });

  Component.configure({
    // Convert into a Lo-Dash template.
    fetchTemplate: _template
  });

  Component.mixin({
    components: {},

    register: function(Component, identifier) {
      // Allow a manual override of the selector to use.
      identifier = identifier || Component.prototype.selector;

      // Register a Component constructor, not an instance.
      this.components[identifier] = {
        ctor: Component,
        instances: []
      };

      if (typeof document.registerElement === "function") {
        //document.registerElement(identifier, Component);
      }

      var cssText = Component.prototype.styles;

      if (cssText) {
        // Create the scoped object outside of the fetch.
        new ScopedCss(identifier, cssText).appendTo(document.body);
      }

      // Save a pointer for easier lookup.
      Component.__pointer__ = this.components[identifier];

      return Component;
    },

    unregister: function(identifier) {
      delete this.components[identifier];
    },

    augment: function(cb) {
      _each(this.__pointer__.instances, function(instance) {
        cb.call(instance, instance);
      });
    },

    activate: function($el, instances) {
      var CurrentComponent = this;

      // Convert all attributes on the Element into View properties.
      var attrs = _reduce($el[0].attributes, function(attrs, attr) {
        // Optionally consume data attributes.
        if (attr.name.indexOf("data-") === 0) {
          attr.name = attr.name.slice(5);
        }

        attrs[attr.name] = attr.value;

        return attrs;
      }, {});

      // Ensure the channel is always an instance.
      if (attrs.channel) {
        attrs.channel = Channel.create(attrs.channel);
      }

      // Associate the element as well.
      attrs.el = $el;

      // Create a new Component.
      var component = new CurrentComponent(attrs);

      // Attach the dataset.
      component.dataset = $el.data();

      // Trigger the standard `createdCallback`.
      if (typeof component.createdCallback === "function") {
        component.createdCallback();
      }

      // Publish the initial data to the view.
      component.on("beforeRender", function() {
        _keys(this.dataset).forEach(function(key) {
          this.channel.publish(key, this.dataset[key]);
        }, this);
      });

      // Set up the channel binding.
      component.on("afterRender", function() {
        var state = this.__state__;
        var component = this;

        // If a channel exists, monitor changes.
        component.channel.subscribe(function(key, value) {
          this.scope = value;
        }, component);
      });

      // Add to the internal cache.
      instances.push(component);

      // By default use the template property provided, otherwise pull the
      // template contents from the DOM.
      if (!component.template) {
        component.template = _template(_unescape($el.html()));
      }

      // Render and apply to the Document.
      component.render();
    },

    activateAll: function(el) {
      el = el || document.body;

      _each(this.components, function(Component, selector) {
        $(el).find(selector).each(function() {
          Component.ctor.activate($(this), Component.instances);
        });
      });
    }
  });

  module.exports = Component;
});
