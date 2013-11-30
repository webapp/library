define(function(require, exports, module) {
  "use strict";

  var _ = require("lodash");
  var Events = require("events");

  describe("Events", function() {
    it("is an object", function() {
      expect(Events).to.be.a("object");
    });
  });
});
