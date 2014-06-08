define(function(require, exports, module) {
  "use strict";

  var _ = require("lodash");
  var Events = require("events");

  describe("Events", function() {
    it("is an object", function() {
      assert.equal(typeof Events, "object");
    });

    // Test for triggerEvents 2, 3 and default.
    // Test for invalid event name in `off`.
    it("will not error with invalid event name in off method", function() {
      var obj = _.extend({}, Events);

      obj.on("valid", function() {});

      assert.doesNotThrow(function() {
        obj.off("invalid");
      });
    });
  });
});
