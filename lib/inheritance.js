define(function(require, exports, module) {
  "use strict";

  var extend = require("lodash/objects/assign");
  var bind = require("lodash/functions/bind");

  // Generalize the initialization of a new instance so that it can be easily
  // called from either `new` or `create`.
  function initialize(Surrogate, child, args) {
    // Invoke the constructor, passing along all arguments.
    Surrogate.prototype.constructor.apply(child, args);

    return child;
  }

  // Optionally allow users to create instances without using the new keyword.
  exports.create = function() {
    return initialize(this, Object.create(this.prototype), arguments);
  };

  // Extends the parent Object, without triggering anything special.
  exports.extend = function(instanceProperties, classProperties) {
    var Parent = this;

    // Extending creates a new constructor that will be based off the parent.
    function Surrogate() {
      // Allow for constructors to be called without `new`.
      if (!(this instanceof Surrogate)) {
        // Only way to pass arguments to a constructor.
        var InnerCtor = bind.apply(null, [Surrogate].concat(arguments));

        // Return a new instance of this constructor.
        return new InnerCtor();
      }

      return initialize(Surrogate, this, arguments);
    }

    // Convenience method for accessing the parent.
    Object.defineProperty(Surrogate, "super", {
      // Keep this property protected.
      writable: false,

      // If no arguments are passed, return the parent prototype, otherwise
      // call the specified method on the parent and pass along all arguments.
      value: function(method, context, args) {
        return method ? Parent.prototype[method].apply(context, args) : Parent;
      }
    });

    // Apply the class properties.
    extend(Surrogate, classProperties);

    // Ensure there is a direct reference to the parent.  `__proto__` will be
    // standardized in ES6.
    Surrogate.__proto__ = Parent;

    // Ensure the prototype inherits from `this`.
    Surrogate.prototype = Object.create(Parent.prototype);

    // Backbone compatibility.
    Surrogate.__super__ = Parent.prototype;

    // Populate prototype with `instanceProperties`.
    extend(Surrogate.prototype, instanceProperties);

    return Surrogate;
  };

  // Allow class properties to be mixed into the constructor.
  exports.mixin = function(classProperties) {
    extend(this, classProperties);
  };
});
