module.exports = ->
  @loadNpmTasks "grunt-karma"

  @config "karma",
    options:
      basePath: process.cwd()
      autoWatch: true

      browsers: ["PhantomJS"]
      frameworks: ["mocha"]
      reporters: ["dots", "coverage"]
      logLevel: "ERROR"

      plugins: [
        "karma-coverage"
        "karma-mocha"
        "karma-phantomjs-launcher"
        "karma-chrome-launcher"
      ]

      files: [
        { pattern: "lib/**/*.js", included: false }
        { pattern: "test/tests/**/*.js", included: false }
        { pattern: "test/vendor/**/*.js", included: false }
        { pattern: "build/**/*.js", included: false }

        "bower_components/assert/assert.js"
        "node_modules/mocha-qunit-ui/mocha-qunit-ui.js"
        "bower_components/requirejs/require.js"
        { pattern: "bower_components/**/*.js", included: false }
        "test/adapter.js"
        "test/runner.js"
      ]

      preprocessors:
        "test/tests/**/*.js": ["coverage"]
        "lib/**/*.js": ["coverage"]

      coverageReporter:
        type: "html"
        dir: "test/coverage/"

    debug:
      options:
        singleRun: false
        browsers: ["Chrome"]

    run:
      options:
        singleRun: true

    watch:
      options:
        singleRun: false
