var baseUrl = window.__karma__ ? "/base/dist/" : "../";

var tests = [
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

// Make async.
if (window.__karma__) { window.__karma__.loaded = function() {}; }

// Set up the assertion library.
// Compatible libraries: http://visionmedia.github.io/mocha/#assertions
window.expect = chai.expect;

require({
  // Set the application endpoint.
  paths: {
    tests: "http://localhost:8000/test/tests",

    jquery: "../../vendor/jquery/jquery",
    lodash: "../../vendor/lodash/dist/lodash",
    q: "../../vendor/q/q",
    scopedcss: "../../vendor/scopedcss/dist/scopedcss",
    ractive: "../../vendor/ractive/build/Ractive"
  },

  // Determine the baseUrl if we are in Karma or not.
  baseUrl: baseUrl + (window.__karma__ ? "amd" : "src"),

  packages: [{
    name: "webapp",
    location: ".",
    main: "webapp.js"
  }],
}, [], function() {

  // Load all tests.
  require(tests, function() {

    // Only once the dependencies have finished loading, call `mocha.run`.
    // Ignore all globals that jQuery creates.
    mocha.globals(["jQuery*"]).run();


    // This will start Karma if it exists.
    if (window.__karma__) { window.__karma__.start(); }
  
  });
});
