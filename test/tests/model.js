define(function(require, exports, module) {
  "use strict";

  var Model = require("model");

  describe("Model", function() {
    it("is a constructor", function() {
      expect(Model).to.be.a("function");
    });
  });
});
