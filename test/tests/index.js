define(function(require, exports, module) {
  "use strict";

  var _ = require("lodash");
  var WebApp = require("index");

  describe("WebApp", function() {
    var app;

    beforeEach(function() {
      app = WebApp.create();
    });

    afterEach(function() {
      app.stop();
    });

    it("is a constructor", function() {
      assert.equal(typeof WebApp, "function");
    });

    it("can start a new instance", function() {
      app.start();

      assert.equal(app.$el.filter("div").length, 1);
    });

    it("ensure the application element is removed upon stopping", function() {
      app.start();
      app.stop();

      assert.equal(app.$el.filter("div").parents().length, 0);
    });
  });
});
