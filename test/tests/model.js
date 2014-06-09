define(function(require, exports, module) {
  "use strict";

  var Model = require("model");

  describe("Model", function() {
    it("is a constructor", function() {
      assert.equal(typeof Model, "function");
    });
  });
});
