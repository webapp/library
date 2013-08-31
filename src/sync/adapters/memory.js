import Adapter from "./sync/adapter";

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

export default Memory;
