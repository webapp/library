(function(window) {
  "use strict";

  var karma = window.__karma__;

  // Put Karma into an asynchronous waiting mode until we have loaded our
  // tests.
  karma.loaded = function() {};

  // Use chai with Mocha.
  window.expect = window.chai.expect;

  // Set the application endpoint and load the configuration.
  require.config({
    paths: {
      specs: "http://localhost:8080/base/test/specs",
      config: "../../build/config"
    },

    packages: [{
      name: "webapp",
      location: ".",
      main: "index.js"
    }, {
      name: "lodash",
      location: "http://localhost:8080/vendor/lodash-amd",
      main: "lodash.js"
    }, {
      name: "jquery",
      location: "../vendor/jquery/src",
      main: "jquery.js"
    }],

    baseUrl: "/base/dist/amd"
  });

  require([
    "config",
    "lodash"
  ],

  function(config, _) {
    var specs = _(karma.files).filter(function(id, file) {
      // Automatically load files from the specs directory.
      return /^\/base\/test\/specs\/.*\.js$/.test(file);
    }).map(function(file) {
      // Strip base from the base path.
      return file.slice("/base".length);
    }).value();

    // Load all specs and start Karma.
    require(specs, karma.start);
  });
})(this);
