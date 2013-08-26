// Exports.
var exports = {};

// Libraries.
import _ from "lodash";

// Generalize the initialization of a new instance so that it can be easily
// called from either `new` or `create`.
function initialize(parent, child, args) {
  // Mix in `instanceProperties` passed.
  _.extend(child, args[0]);

  // Invoke the constructor, passing along all arguments.
  child.constructor.apply(child, args);

  return child;
}

// Optionally allow users to create instances without using the new keyword.
exports.create = function() {
  return initialize(this.__proto__, Object.create(this.prototype), arguments);
};

// Extends the parent Object, without triggering anything special.
exports.extend = function(instanceProperties, classProperties) {
  var Parent = this;

  // Extending creates a new constructor that will be based off the parent.
  function Surrogate() {
    initialize(Parent, this, arguments);
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
  _.extend(Surrogate, classProperties);

  // Ensure there is a direct reference to the parent.  `__proto__` will be
  // standardized in ES6.
  Surrogate.__proto__ = Parent;

  // Ensure the prototype inherits from `this`.
  Surrogate.prototype = Object.create(Parent.prototype);

  // Populate prototype with `instanceProperties`.
  _.extend(Surrogate.prototype, instanceProperties);

  return Surrogate;
};

// Allow class properties to be mixed into the constructor.
exports.mixin = function(classProperties) {
  _.extend(this, classProperties);
};

export default exports;