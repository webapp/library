(function(window) {
  "use strict";

  var karma = window.__karma__;
  var baseUrl = karma ? "/base/" : "../";

  var tests = [
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
    "tests/view"
  ];

  // Prefer the BDD testing style.
  mocha.setup("bdd");
  // Use Chai as the assertion library.
  window.expect = chai.expect;

  // Make async.
  if (karma) { karma.loaded = function() {}; }

  require({
    // Set the application endpoint.
    paths: {
      tests: "../test/tests",
      sizzle: "../bower_components/jquery/bower_components/sizzle/dist/sizzle",
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
    require(tests, karma ? karma.start : function() {});
  });
})(this);
