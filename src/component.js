// Libraries.
import $ from "jquery";
import _ from "lodash";
import ScopedCss from "scopedcss";

// Modules.
import View from "./view";

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
    return _.template(contents);
  }
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

    var cssText = Component.prototype.styles;

    if (cssText) {
      // Create the scoped object outside of the fetch.
      ScopedCss(identifier, cssText).appendTo(document.body);
    }

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
    var Component = this;

    // Convert all attributes on the Element into View properties.
    var attrs = _.reduce($el[0].attributes, function(attrs, attr) {
      attrs[attr.name] = attr.value;
      return attrs;
    }, {});

    // Associate the element as well.
    attrs.el = $el;

    // Create a new Component.
    var component = new Component(attrs);

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

  activateAll: function(el) {
    _.each(this.components, function(Component, selector) {
      $(el).find(selector).each(function() {
        Component.ctor.activate($(this), Component.instances);
      });
    });
  }
});

export default Component;
