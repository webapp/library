(function(window) {
  "use strict";

  var karma = window.__karma__;
  var baseUrl = karma ? "/base/" : "../";

  var tests = [
    // WebApp library tests.
    "tests/component/view",
    "tests/sync/adapters/memory",
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
    "backbone/test/environment",
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
    "layoutmanager/test/spec/setup",
    "layoutmanager/test/spec/views"
  ];

  // Prefer the BDD testing style.
  mocha.setup("bdd");
  mocha.setup("qunit");

  // Use Chai as the assertion library.
  window.expect = chai.expect;

  // Make async.
  if (karma) { karma.loaded = function() {}; }

  require({
    // Set the application endpoint.
    paths: {
      tests: "../test/tests",
      backbone: "../bower_components/backbone",
      layoutmanager: "../bower_components/layoutmanager",
      sizzle: "../bower_components/sizzle/dist/sizzle",
      scopedcss: "../bower_components/scopedcss/dist/scopedcss",
      ractive: "../bower_components/ractive/build/Ractive"
    },

    // Determine the baseUrl if we are in Karma or not.
    baseUrl: baseUrl + "src",

    packages: [{
      name: "webapp",
      location: ".",
      main: "index.js"
    }, {
      name: "lodash",
      location: "../bower_components/lodash-amd/modern",
      main: "main.js"
    }, {
      name: "jquery",
      location: "../bower_components/jquery/src",
      main: "jquery.js"
    }],
  }, [], function() {
    require(['index', 'view', 'lodash'], function(WebApp, View, _) {
      window.Backbone = WebApp;
      window.Backbone.Layout = View;
      window._ = _;
      window.$ = WebApp.$;

      console.log(Backbone.Layout);

      require(tests, karma ? karma.start : function() {});
    });
  });
})(this);
