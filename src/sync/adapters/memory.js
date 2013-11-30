define(function(require, exports, module) {
  "use strict";

  var Adapter = require("../adapter");

  var Memory = Adapter.extend({
    isAvailable: function() {
      return !!this.cache;
    },

    get: function() {
      return this.cache;
    },

    set: function(objects) {
      this.cache = objects;
    }
  });

  module.exports = Memory;
});
