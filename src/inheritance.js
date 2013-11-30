module _ from "lodash";

// Generalize the initialization of a new instance so that it can be easily
// called from either `new` or `create`.
function initialize(Surrogate, child, args) {
  // Invoke the constructor, passing along all arguments.
  Surrogate.prototype.constructor.apply(child, args);

  return child;
}

// Optionally allow users to create instances without using the new keyword.
export function create() {
  return initialize(this, Object.create(this.prototype), arguments);
}

// Extends the parent Object, without triggering anything special.
export function extend(instanceProperties, classProperties) {
  var Parent = this;

  // Extending creates a new constructor that will be based off the parent.
  function Surrogate() {
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
  _.extend(Surrogate, classProperties);

  // Ensure there is a direct reference to the parent.  `__proto__` will be
  // standardized in ES6.
  Surrogate.__proto__ = Parent;

  // Ensure the prototype inherits from `this`.
  Surrogate.prototype = Object.create(Parent.prototype);

  // Backbone compatibility.
  Surrogate.__super__ = Parent.prototype;

  // Populate prototype with `instanceProperties`.
  _.extend(Surrogate.prototype, instanceProperties);

  return Surrogate;
}

// Allow class properties to be mixed into the constructor.
export function mixin(classProperties) {
  _.extend(this, classProperties);
}
