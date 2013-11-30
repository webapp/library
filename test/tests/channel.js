define(function(require, exports, module) {
  "use strict";

  var Channel = require("channel");
  var Model = require("model");

  describe("Channel", function() {
    it("is a constructor", function() {
      expect(Channel).to.be.a("function");
    });

    it("requires a name", function() {
      var channel;
      var channel2;
      var channel3;

      // Code coverage does not detect if (!name) code path with Chai#throw.
      // Manual try/catch necessary for this reason.
      try {
        channel = Channel.create();
      } catch (ex) { channel = undefined; }

      try {
        channel2 = Channel.create("name invalid");
      } catch (ex) { channel2 = undefined; }

      try {
        channel3 = Channel.create("name");
      } catch (ex) { channel3 = undefined; }

      expect(channel).to.equal(undefined);
      expect(channel2).to.equal(undefined);
      expect(channel3).to.be.an.instanceof(Channel);
    });

    describe("when intializing", function() {
      var channel = Channel.create("cache-first");
      var channel2 = Channel.create("cache-first");
      var channel3 = Channel.create("new-instance");

      it("will cache instances by name", function() {
        channel.testing = true;

        expect(channel).to.not.equal(channel2);
        expect(channel.testing).to.equal(true);
      });

      it("will not share instances with different names", function() {
        expect(channel3.testing).to.equal(undefined);
      });
    });
  });
});
