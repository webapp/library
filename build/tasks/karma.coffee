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

        "node_modules/backbone.layoutmanager/test/util/util.js"
        "node_modules/assert/dist.js"
        "node_modules/mocha-qunit-ui/mocha-qunit-ui.js"
        "node_modules/requirejs/require.js"
        { pattern: "node_modules/**/*.js", included: false }
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
