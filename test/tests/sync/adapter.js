define(function(require, exports, module) {
  "use strict";

  var Adapter = require("sync/adapter");

  describe("Adapter", function() {
    it("is a constructor", function() {
      expect(Adapter).to.be.a("function");
    });
  });
});
