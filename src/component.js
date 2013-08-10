define(function(require, exports, module) {
  "use strict";

  var _ = require("lodash");
  var $ = require("jquery");

  var View = require("./view");

  // The View base class for the Component.
  var Component = View.extend({
    constructor: function() {
      if (!this.tagName) {
        throw new Error("tagName required to initialize component.");
      }

      var cssText = this.style || "";

      // Swap out the `@host` for the `tagName`.
      cssText = cssText.replace(/\@host/g, this.tagName);

      // This is a `<style/>` tag associated with the Component.
      this.styleTag = $("<style>");

      // If styles were provided set them.  TODO maybe a convenience method to
      // allow end users to update the styles.
      if (this.style) {
        // Insert the CSS and render it in the DOM.
        this.styleTag[0].innerHTML = cssText;
        this.styleTag.appendTo("body");

        // Parse out the last styleSheet.
        var styleSheet = document.styleSheets[document.styleSheets.length-1];
        var rules = styleSheet.cssRules;

        // For all the rules, scope the selector.
        _.each(_.clone(rules), function(rule, index) {
          // Prepend a space to make it easier to replace without a trailing
          // character.
          var cssText = rule.selectorText;

          //// If this is a `@host` scoped selector, then use only the `tagName`,
          //// otherwise keep the remaining selector.
          cssText = cssText || this.tagName;

          //// Remove this rule.
          //styleSheet.deleteRule(index);

          //// Insert a new one.
          //styleSheet.insertRule(this.tagName + " " + cssText, index);
          rule.selectorText = this.tagName + " " + cssText;
        }, this);
      }

      // Ensure the View is correctly set up.
      Component.super("constructor", this, arguments);
    },

    afterRender: function() {
      // Seek out nested components and render them.
      Component.activateAll(this.$el);
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
      // Allow a manual override of the tagName to use.
      identifier = identifier || Component.prototype.tagName;

      // Register a Component constructor, not an instance.
      return this.components[identifier] = Component;
    },

    unregister: function(identifier) {
      delete this.components[identifier];
    },

    activate: function($el) {
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

      // By default use the template property provided, otherwise pull the
      // template contents from the DOM.
      if (!component.template) {
        component.template = _.template(_.unescape($el.html()));
      }

      // Render and apply to the Document.
      component.render();
    },

    activateAll: function($el) {
      _.each(this.components, function(Component, tagName) {
        $el.children(tagName).each(function() {
          Component.activate($(this));
        });
      });
    }
  });

  module.exports = Component;
});
