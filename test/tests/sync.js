define(function(require, exports, module) {
  "use strict";

  var Sync = require("sync");

  describe("Sync", function() {
    it("is a function", function() {
      assert.equal(typeof Sync, "function");
    });
  });
});
