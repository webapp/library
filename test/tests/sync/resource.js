define(function(require, exports, module) {
  "use strict";

  var Resource = require("sync/resource");

  describe("Resource", function() {
    it("is a constructor", function() {
      assert.equal(typeof Resource, "function");
    });
  });
});
