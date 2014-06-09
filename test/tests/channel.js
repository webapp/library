define(function(require, exports, module) {
  "use strict";

  var Channel = require("channel");
  var sinon = require("sinon");

  describe("Channel", function() {
    it("is a constructor", function() {
      assert.equal(typeof Channel, "function");
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

      channel3 = Channel.create("name");

      assert.equal(channel, undefined);
      assert.equal(channel2, undefined);
      assert(channel3 instanceof Channel);
    });

    describe("when initializing", function() {
      var channel = Channel.create("cache-first");
      var channel2 = Channel.create("cache-first");
      var channel3 = Channel.create("new-instance");

      it("will cache instances by name", function() {
        channel.testing = true;

        assert.notEqual(channel, channel2);
        assert.equal(channel.testing, true);
      });

      it("will not share instances with different names", function() {
        assert.equal(channel3.testing, undefined);
      });
    });

    describe("subscription", function() {
      var channel = Channel.create("test");

      after(function() {
        channel.unsubscribe();
      });

      it("invokes the callback when published to", function() {
        var callback = sinon.spy();

        channel.subscribe(callback);
        channel.publish("value", "key");

        assert.equal(callback.calledOnce, true);
        assert.equal(callback.thisValues[0], channel);
        assert.equal(callback.args[0][0], "value");
        assert.equal(callback.args[0][1], "key");
      });
    });

    describe("unsubscription", function() {
      var channel = Channel.create("test");

      it("will remove callbacks", function() {
        var callback = sinon.spy();

        channel.subscribe(callback);
        channel.unsubscribe();
        channel.publish("value", "key");

        assert.equal(callback.called, false);
      });
    });

    describe("publishing", function() {
      var channel = Channel.create("test");

      it("can parse an object", function() {
        var callback = sinon.spy();

        channel.subscribe(callback);
        channel.publish({ "key": "value" });

        assert.equal(callback.called, true);
        assert.equal(callback.thisValues[0], channel);
        assert.equal(callback.args[0][0], "key");
        assert.equal(callback.args[0][1], "value");
      });
    });
  });
});
