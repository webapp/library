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
      location: "../bower_components/lodash-amd/modern",
      main: "main.js"
    }, {
      name: "jquery",
      location: "../bower_components/jquery/src",
      main: "jquery.js"
    }],

    baseUrl: "/base/src"
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
