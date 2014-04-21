define(function(require, exports, module) {
  "use strict";

  var Channel = require("channel");
  var sinon = require("sinon");

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

      channel3 = Channel.create("name");

      expect(channel).to.equal(undefined);
      expect(channel2).to.equal(undefined);
      expect(channel3).to.be.an.instanceof(Channel);
    });

    describe("when initializing", function() {
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

    describe("subscription", function() {
      var channel = Channel.create("test");

      after(function() {
        channel.unsubscribe();
      });

      it("invokes the callback when published to", function() {
        var callback = sinon.spy();

        channel.subscribe(callback);
        channel.publish("value", "key");

        expect(callback.calledOnce).to.equal(true);
        expect(callback.thisValues[0]).to.equal(channel);
        expect(callback.args[0][0]).to.equal("value");
        expect(callback.args[0][1]).to.equal("key");
      });
    });

    describe("unsubscription", function() {
      var channel = Channel.create("test");

      it("will remove callbacks", function() {
        var callback = sinon.spy();

        channel.subscribe(callback);
        channel.unsubscribe();
        channel.publish("value", "key");

        expect(callback.called).to.equal(false);
      });
    });

    describe("publishing", function() {
      var channel = Channel.create("test");

      it("can parse an object", function() {
        var callback = sinon.spy();

        channel.subscribe(callback);
        channel.publish({ "key": "value" });

        expect(callback.called).to.equal(true);
        expect(callback.thisValues[0]).to.equal(channel);
        expect(callback.args[0][0]).to.equal("key");
        expect(callback.args[0][1]).to.equal("value");
      });
    });
  });
});
