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
    //"tests/index",
    "tests/inheritance",
    "tests/model",
    "tests/router",
    //"tests/sync",
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
    //"layoutmanager/test/spec/configure",
    //"layoutmanager/test/spec/dom",
    //"layoutmanager/test/spec/setup",
    //"layoutmanager/test/spec/views"
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
      sizzle: "../bower_components/sizzle/dist/sizzle",
      scopedcss: "../bower_components/scopedcss/dist/scopedcss",
      ractive: "../bower_components/ractive/build/Ractive",
      jquery: "../bower_components/jquery/jquery",
      lodash: "../bower_components/lodash/dist/lodash"
    },

    // Determine the baseUrl if we are in Karma or not.
    baseUrl: baseUrl + "src",

    map: {
      "layoutmanager": {
        "backbone": "webapp",
        "underscore": "lodash"
      }
    },

    packages: [{
      name: "webapp",
      location: ".",
      main: "index.js"
    }, {
      name: "backbone",
      location: "../bower_components/backbone",
      main: "backbone.js"
    }, {
      name: "layoutmanager",
      location: "../bower_components/layoutmanager",
      main: "backbone.layoutmanager.js"
    }],
  }, [], function() {
    require(['webapp', 'view', 'lodash'], function(WebApp, LM, _) {
      window.Backbone = WebApp;
      window.Backbone.Layout = LM;
      window._ = _;
      window.$ = Backbone.$;

      require(tests, karma ? karma.start : mocha.run);
    });
  });
})(this);
