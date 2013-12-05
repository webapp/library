module.exports = ->
  @initConfig

    clean: ["dist", "test/reports"]

    jshint:
      default: [
        "src/**/*.js",
        "!src/collection.js"
        "!src/history.js"
        "!src/model.js"
        "!src/router.js"
        "!src/sync.js"
        "!src/sync/transports/xhr.js"
        "test/tests/**/*.js"
      ]

      options:
        eqnull: true
        boss: true
        undef: true
        proto: true

        globals:
          window: true
          document: true
          navigator: true
          define: true
          require: true
          describe: true
          it: true
          expect: true
          beforeEach: true
          afterEach: true

    requirejs:
      options:
        mainConfigFile: "build/config.js"
        findNestedDependencies: true
        logLevel: 2
        skipModuleInsertion: false
        useStrict: true

        wrap:
          startFile: "build/start.js"
          endFile: "build/end.js"

      amd:
        options:
          targetFolder: "dist/"
          optimize: "none"
          out: "dist/webapp.js"

      bundled:
        options:
          optimize: "none"
          out: "dist/webapp.bundled.js"
          exclude: []

    karma:
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
          { pattern: "src/**/*.js", included: false }
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
          "src/**/*.js": ["coverage"]

        coverageReporter:
          type: "lcov"
          dir: "test/reports/coverage/"

      run:
        options:
          singleRun: true

      daemon:
        options:
          singleRun: false

  @loadNpmTasks "grunt-contrib-clean"
  @loadNpmTasks "grunt-contrib-jshint"
  @loadNpmTasks "grunt-contrib-requirejs"
  @loadNpmTasks "grunt-karma"

  @registerTask "test", ["karma:run"]
  @registerTask "default", [
    "clean"
    "jshint"
    "requirejs"
    "test"
  ]
