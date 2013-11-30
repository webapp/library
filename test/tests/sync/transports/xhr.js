define(function(require, exports, module) {
  "use strict";

  var XhrTransport = require("sync/transports/xhr");

  describe("XhrTransport", function() {
    it("is a constructor", function() {
      expect(XhrTransport).to.be.a("function");
    });
  });
});
