define(function(require, exports, module) {
  "use strict";

  var RestAdapter = require("sync/adapters/rest");

  describe("RestAdapter", function() {
    it("is a constructor", function() {
      assert(typeof RestAdapter, "function");
    });
  });
});
