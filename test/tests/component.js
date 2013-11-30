define(function(require, exports, module) {
  "use strict";

  var Component = require("component");

  describe("Component", function() {
    it("is a constructor", function() {
      expect(Component).to.be.a("function");
    });
  });
});
