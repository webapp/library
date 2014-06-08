define(function(require, exports, module) {
  "use strict";

  var _ = require("lodash");
  var WebApp = require("index");

  describe("WebApp", function() {
    it("is a constructor", function() {
      assert.equal(typeof WebApp, "function");
    });
  });
});
