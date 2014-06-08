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
    //"tests/index",
    "tests/inheritance",
    "tests/model",
    "tests/router",
    //"tests/sync",
    "tests/view",

    // Backbone tests.
    "backbone/test/noconflict",
    "backbone/test/events",
    //"backbone/test/model",
    //"backbone/test/collection",
    "backbone/test/router",
    "backbone/test/view",
    "backbone/test/sync",

    // LayoutManager tests.
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
      backbone: "../bower_components/backbone",
      sinon: "../bower_components/sinon/lib/sinon"
    },

    baseUrl: baseUrl + "build"
  }, ["config"], function(config) {
    // Reset the baseUrl to the source directory.
    require.s.contexts._.config.baseUrl = baseUrl + "lib/";

    // Set up the library to expose globals.
    require(['webapp', 'view', 'lodash'], function(WebApp, View, _) {
      window.Backbone = WebApp;
      window.Backbone.Layout = View;
      window._ = _;
      window.$ = Backbone.$;

      require(["backbone/test/environment"], function() {
        // Kick off the tests.
        require(tests, karma ? karma.start : function() { mocha.run(); });
      });
    });
  });
})(this);
