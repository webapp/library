define(function(require, exports, module) {
  "use strict";

  var Transport = require("sync/transport");

  describe("Transport", function() {
    it("is a constructor", function() {
      assert.equal(typeof Transport, "function");
    });
  });
});
