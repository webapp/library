import $ from "jquery";
import ScopedCss from "scopedcss";
import Events from "./events";
import View from "./view";
import Channel from "./channel";

import _template from "lodash/utilities/template";
import _templateSettings from "lodash/utilities/templateSettings";
import _extend from "lodash/objects/assign";
import _each from "lodash/collections/forEach";
import _reduce from "lodash/collections/reduce";
import _unescape from "lodash/utilities/unescape";

// The View base class for the Component.
var Component = View.extend({
  constructor: function() {
    if (!this.selector) {
      throw new Error("selector required to initialize component.");
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
  // By default the template property contains the contents of the template.
  fetchTemplate: function(contents) {
    // Convert into a Lo-Dash template.
    return _template(contents);
  }
});

Component.mixin({
  components: {},

  // Channels provide an interconnected data bus.
  channels: _extend({}, Events),

  register: function(Component, identifier) {
    // Allow a manual override of the selector to use.
    identifier = identifier || Component.prototype.selector;

    // Register a Component constructor, not an instance.
    this.components[identifier] = {
      ctor: Component,
      instances: []
    };

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

    // Associate the element as well.
    attrs.el = $el;

    // Create a new Component.
    var component = new CurrentComponent(attrs);

    // Set up the channel binding.
    component.on("afterRender", function() {
      var state = this.__state__;
      var component = this;

      if (!state.binding) {
        return;
      }

      // Replace the string channel name with an instance.
      if (typeof component.channels === "string") {
        component.channel = new Channel(component.channels);
      }

      if (component.channel) {
        // If a channel exists, monitor changes.
        component.channel.subscribe(function(value, key) {
          if (this.get(key) !== value) {
            this.set(key, value);
          }
        }, component);

        state.binding.on("set", function(key, value) {
          component.channel.publish(key, value);
        });
      }
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
    _each(this.components, function(Component, selector) {
      $(el).find(selector).each(function() {
        Component.ctor.activate($(this), Component.instances);
      });
    });
  }
});

export default Component;
