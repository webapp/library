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
      ]

      files: [
        { pattern: "lib/**/*.js", included: false }
        { pattern: "test/tests/**/*.js", included: false }
        { pattern: "bower_components/**/*.js", included: false }
        { pattern: "build/**/*.js", included: false }

        "test/vendor/chai.js"
        "test/vendor/mocha-qunit-ui.js"
        "test/vendor/require.js"
        "test/vendor/adapter.js"
        "test/runner.js"
      ]

      preprocessors:
        "test/tests/**/*.js": ["coverage"]
        "lib/**/*.js": ["coverage"]

      coverageReporter:
        type: "lcov"
        dir: "test/reports/coverage/"

    run:
      options:
        singleRun: true

    daemon:
      options:
        singleRun: false
