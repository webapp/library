define(function(require, exports, module) {
  "use strict";

  var MemoryAdapter = require("sync/adapters/memory");

  describe("MemoryAdapter", function() {
    it("is a constructor", function() {
      expect(MemoryAdapter).to.be.a("function");
    });
  });
});
