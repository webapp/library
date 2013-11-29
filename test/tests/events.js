module _ from "lodash";
module Events from "events";

describe("Events", function() {
  it("is an object", function() {
    expect(Events).to.be.a("object");
  });
});
