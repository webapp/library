(function(window) {
  "use strict";

  var karma = window.__karma__;
  var baseUrl = karma ? "/base/" : "../";

  var tests = [
    // WebApp Library tests.
    "tests/component/view",
    "tests/sync/adapters/rest",
    "tests/sync/transports/xhr",
    "tests/sync/adapter",
    "tests/sync/resource",
    "tests/sync/transport",
    "tests/channel",
    "tests/class",
    "tests/collection",
    "tests/component",
    "tests/events",
    "tests/index",
    "tests/inheritance",
    "tests/model",
    "tests/router",
    "tests/sync",
    "tests/view",

    // Backbone tests.
    "backbone/test/noconflict",
    "backbone/test/events",
    "backbone/test/model",
    "backbone/test/collection",
    "backbone/test/router",
    "backbone/test/view",
    "backbone/test/sync",

    // LayoutManager tests.
    "layoutmanager/test/spec/configure",
    "layoutmanager/test/spec/dom",
    //"layoutmanager/test/spec/setup",
    "layoutmanager/test/spec/views"
  ];

  // Prefer the BDD testing style.
  mocha.setup("bdd");
  mocha.setup("qunit");

  // Make async.
  if (karma) { karma.loaded = function() {}; }

  require({
    paths: {
      tests: "../test/tests",
      backbone: "../test/vendor/backbone",
      sinon: "../node_modules/sinon/lib/sinon",
      layoutmanager: "../node_modules/backbone.layoutmanager"
    },

    baseUrl: baseUrl + "lib"
  }, ["config"], function(config) {
    // Set up the library to expose globals.
    require(["index", "underscore"], function(WebApp, _) {
      window.Backbone = WebApp;
      window.Backbone.Layout = WebApp.View.extend({
        constructor: function() {
          console.log('here');
        },

        manage: true
      });
      window._ = _;
      window.$ = Backbone.$;

      // Necessary for sync tests.
      window.raises = QUnit.throws;

      // Kick off the tests.
      require(["backbone/test/environment"], function() {
        require(tests, karma ? karma.start : function() { mocha.run(); });
      });
    });
  });
})(this);
