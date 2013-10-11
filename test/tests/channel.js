import Channel from "channel";
import Model from "model";

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

  it("defaults to an empty model", function() {
    var channel = Channel.create("name");

    expect(channel.model).to.be.an.instanceof(Model);
    expect(channel.model.keys().length).to.equal(0);
  });

  describe("when intializing", function() {
    var channel = Channel.create("cache-first");
    var channel2 = Channel.create("cache-first");
    var channel3 = Channel.create("new-instance");

    it("will cache instances by name", function() {
      channel.model.set("Testing", true);

      expect(channel).to.not.equal(channel2);
      expect(channel.model.get("Testing")).to.equal(true);
    });

    it("will not share instances with different names", function() {
      expect(channel3.model.get("Testing")).to.equal(undefined);
    });
  });
});

