define(function(require, exports, module) {
  "use strict";

  var RestAdapter = require("sync/adapters/rest");

  describe("RestAdapter", function() {
    it("is a constructor", function() {
      expect(RestAdapter).to.be.a("function");
    });
  });
});
