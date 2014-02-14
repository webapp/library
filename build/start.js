(function(window, factory) {
  "use strict";

  if (typeof exports === "object") {
    // Node. Does not work with strict CommonJS, but only CommonJS-like
    // enviroments that support module.exports, like Node.
    module.exports = factory.call(window);
  } else if (typeof define === "function" && define.amd) {
    // Allow using this built library as an AMD module in another project. That
    // other project will only see this AMD call, not the internal modules in
    // the closure below.
    define(factory.bind(window));
  } else {
    // Browser globals case. Just assign the result to a property on the
    // global.
    window.WebApp = factory.call(window);

    // Detect if Backbone exists on the page and run `noConflict` on it, saving
    // to an accessible property on the WebApp object.
    if (window.Backbone) {
      window.WebApp.Backbone = window.Backbone;
    }

    // Overwrite the Backbone global with this object.
    window.Backbone = window.WebApp;
  }
}(this, function() {
"use strict";

// Ensure the global window object is always `this`.
var window = this;
