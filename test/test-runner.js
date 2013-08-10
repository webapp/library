var baseUrl = window.__karma__ ? "/base/" : "../";

var tests = [
  "tests/collection",
  "tests/entity",
  "tests/events",
  "tests/index",
  "tests/inheritance",
  "tests/class",
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
  paths: { tests: baseUrl + "test/tests" },

  // Determine the baseUrl if we are in Karma or not.
  baseUrl: baseUrl
},

// Load the configuration.
["build/config"],

function() {

  // Update the baseUrl after loading everything.
  require.s.contexts._.config.baseUrl = baseUrl + "src/";

  // Load all tests.
  require(tests, function() {

    // Only once the dependencies have finished loading, call `mocha.run`.
    // Ignore all globals that jQuery creates.
    mocha.globals(["jQuery*"]).run();


    // This will start Karma if it exists.
    if (window.__karma__) { window.__karma__.start(); }
  
  });
});
