(function(window) {
  "use strict";

  var karma = window.__karma__;
  var baseUrl = karma ? "/base/" : "../";

  var tests = [
    // WebApp library tests.
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
    //"backbone/test/model",
    //"backbone/test/collection",
    "backbone/test/router",
    "backbone/test/view",
    //"backbone/test/sync",

    // TODO LayoutManager tests.
    //"layoutmanager/test/spec/configure",
    //"layoutmanager/test/spec/dom",
    //"layoutmanager/test/spec/setup",
    //"layoutmanager/test/spec/views"
  ];

  // Prefer the BDD testing style.
  mocha.setup("bdd");
  mocha.setup("qunit");

  // Make async.
  if (karma) { karma.loaded = function() {}; }

  require({
    paths: {
      tests: "../test/tests",
      backbone: "../vendor/backbone",
      sinon: "../node_modules/sinon/lib/sinon",
      layoutmanager: "../bower_components/layoutmanager/"
    },

    baseUrl: baseUrl + "lib"
  }, ["config"], function(config) {
    // Set up the library to expose globals.
    require(["index", "view", "lodash", "sync"], function(WebApp, View, _) {
      window.Backbone = WebApp;
      window.Backbone.Layout = View;
      window._ = _;
      window.$ = Backbone.$;

      // Kick off the tests.
      require(["backbone/test/environment"], function() {
        require(tests, karma ? karma.start : function() { mocha.run(); });
      });
    });
  });
})(this);
